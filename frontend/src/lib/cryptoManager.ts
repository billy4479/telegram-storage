import { encode, decode } from 'base64-arraybuffer';

export class KeyStore {
  masterKey: CryptoKey;
  masterKeySalt: Uint8Array;

  shareKeyPair: CryptoKeyPair;
}

let cryptoManager: CryptoManager | null = null;

export function getCryptoManager(): CryptoManager {
  return cryptoManager;
}

export class CryptoManager {
  private ks: KeyStore;

  private constructor() {
    this.ks = new KeyStore();
  }

  static async newUser(password: string): Promise<{
    cryptoManager: CryptoManager;
    registrationData: Promise<{
      masterKeySalt: string;
      authKey: string;
      sharePublicKey: string;
      sharePrivateKeyEnc: string;
    }>;
  }> {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const masterKey = CryptoManager.masterKeyFromPasswordAndSalt(
      password,
      salt
    );

    const shareKeyPair = crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-512',
      },
      true,
      ['encrypt', 'decrypt']
    );

    const cm = new CryptoManager();
    cm.ks.masterKeySalt = salt;
    cm.ks.masterKey = await masterKey;
    cm.ks.shareKeyPair = await shareKeyPair;

    cryptoManager = cm;

    return {
      cryptoManager: cm,
      registrationData: (async () => {
        const shareKeys = await getCryptoManager().exportShareKeys();
        return {
          authKey: await getCryptoManager().getAuthKey(),
          masterKeySalt: encode(salt),
          sharePrivateKeyEnc: shareKeys.priv,
          sharePublicKey: shareKeys.pub,
        };
      })(),
    };
  }

  private static async masterKeyFromPasswordAndSalt(
    password: string,
    salt: Uint8Array
  ): Promise<CryptoKey> {
    const passwordKey = window.crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      'PBKDF2',
      false,
      ['deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256',
      },
      await passwordKey,
      { name: 'AES-KW', length: 256 },
      true,
      ['wrapKey', 'unwrapKey']
    );
  }

  static async fromPasswordAndSalt(
    password: string,
    salt: string
  ): Promise<CryptoManager> {
    const decodedSalt = new Uint8Array(decode(salt));

    const masterKey = this.masterKeyFromPasswordAndSalt(password, decodedSalt);

    const cm = new CryptoManager();
    cm.ks.masterKey = await masterKey;
    cm.ks.masterKeySalt = decodedSalt;

    cryptoManager = cm;
    return cm;
  }

  static async fromMasterKey(masterKey: string): Promise<CryptoManager> {
    const mk = crypto.subtle.importKey(
      'raw',
      decode(masterKey),
      { name: 'AES-KW', length: 256 },
      true,
      ['encrypt', 'decrypt', 'wrapKey', 'unwrapKey']
    );

    const cm = new CryptoManager();
    cm.ks.masterKey = await mk;

    cryptoManager = cm;
    return cm;
  }

  async exportShareKeys(): Promise<{
    pub: string;
    priv: string;
  }> {
    console.log(
      (await crypto.subtle.exportKey('raw', this.ks.shareKeyPair.privateKey))
        .byteLength
    );
    const privEnc = crypto.subtle.wrapKey(
      'raw',
      this.ks.shareKeyPair.privateKey,
      this.ks.masterKey,
      'AES-KW'
    );

    const pub = crypto.subtle.exportKey('raw', this.ks.shareKeyPair.publicKey);

    return {
      pub: encode(await pub),
      priv: encode(await privEnc),
    };
  }

  async importShareKeys(pub: string, priv: string): Promise<void> {
    const privDec = crypto.subtle.unwrapKey(
      'raw',
      decode(priv),
      this.ks.masterKey,
      'AES-KW',
      {
        name: 'RSA-OAEP',
        hash: 'SHA-512',
      },
      true,
      ['encrypt', 'decrypt']
    );

    const pubDec = crypto.subtle.importKey(
      'raw',
      decode(pub),
      {
        name: 'RSA-OAEP',
        hash: 'SHA-512',
      },
      true,
      ['encrypt', 'decrypt']
    );

    this.ks.shareKeyPair = {
      privateKey: await privDec,
      publicKey: await pubDec,
    };
  }

  async getAuthKey(): Promise<string> {
    const key = encode(
      await crypto.subtle.digest(
        'SHA-512',
        await crypto.subtle.exportKey('raw', this.ks.masterKey)
      )
    );

    console.log(key);
    return key;
  }

  async getMasterKey(): Promise<string> {
    return encode(await crypto.subtle.exportKey('raw', this.ks.masterKey));
  }

  async encryptFile(file: ArrayBuffer): Promise<{
    file: ArrayBuffer;
    key: string;
    iv: string;
  }> {
    const key = await crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      true,
      ['encrypt']
    );

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encryptedFile = crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      file
    ) as Promise<ArrayBuffer>;

    const encryptedKey = crypto.subtle.wrapKey(
      'raw',
      key,
      this.ks.shareKeyPair.publicKey,
      { name: 'RSA-OAEP' }
    );

    return {
      file: await encryptedFile,
      key: encode(await encryptedKey),
      iv: encode(iv),
    };
  }

  async decryptFile(
    file: ArrayBuffer,
    iv: string,
    keyEnc: string
  ): Promise<ArrayBuffer> {
    const key = crypto.subtle.unwrapKey(
      'raw',
      decode(keyEnc),
      this.ks.shareKeyPair.privateKey,
      { name: 'RSA-OAEP' },
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );

    const decryptedFile = crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: decode(iv) },
      await key,
      file
    );

    return decryptedFile;
  }
}
