import sodium from 'libsodium-wrappers';

export interface KeyStore {
  masterKey: Uint8Array;
  masterKeySalt: Uint8Array;

  authKey: Uint8Array;

  shareKeyPair: sodium.KeyPair;
  sharePrivateKeyNonce: Uint8Array;
}

export interface CreateUserKeys {
  masterKeySalt: string;
  authKey: string;

  sharePublicKey: string;
  sharePrivateKeyEnc: string;
  sharePrivateKeyNonce: string;
}

let cryptoManager: CryptoManager | null = null;

export function getCryptoManager() {
  return cryptoManager;
}

export class CryptoManager {
  private _initPromise: Promise<void>;
  private _libSodium: typeof sodium | null;

  private _keyStore: KeyStore;

  private constructor() {
    this._libSodium = null;
    this._initPromise = (async (): Promise<void> => {
      await sodium.ready;
      this._libSodium = sodium;
    })();
  }

  private get initialized(): Promise<CryptoManager> {
    if (this._libSodium) return Promise.resolve(this);

    return this._initPromise.then(() => {
      return this;
    });
  }

  static async fromPasswordAndSalt(
    password: string,
    salt: string
  ): Promise<CryptoManager> {
    cryptoManager = await new CryptoManager().initialized;
    cryptoManager._deriveMasterKey(
      password,
      cryptoManager._libSodium.from_base64(salt)
    );
    cryptoManager._deriveAuthKey();
    return cryptoManager;
  }

  static async createUser(password: string): Promise<{
    manager: CryptoManager;
    keys: CreateUserKeys;
  }> {
    // if (!this._libSodium) throw new Error('KeyStore is not initialized');

    const salt = new Uint8Array(length);
    window.crypto.getRandomValues(salt);

    const manager = await new CryptoManager().initialized;
    manager._deriveMasterKey(password, salt);
    manager._deriveAuthKey();

    manager._keyStore.shareKeyPair = manager._libSodium.crypto_box_keypair();

    manager._keyStore.sharePrivateKeyNonce = manager._genRandomBuffer(
      manager._libSodium.crypto_secretbox_NONCEBYTES
    );
    const sharePrivateKeyEnc = manager._libSodium.crypto_secretbox_easy(
      manager._keyStore.shareKeyPair.privateKey,
      manager._keyStore.sharePrivateKeyNonce,
      manager._keyStore.masterKey
    );

    cryptoManager = manager;

    return {
      manager,
      keys: {
        masterKeySalt: manager._libSodium.to_base64(
          manager._keyStore.masterKeySalt
        ),
        authKey: manager._libSodium.to_base64(manager._keyStore.authKey),
        sharePublicKey: manager._libSodium.to_base64(
          manager._keyStore.shareKeyPair.publicKey
        ),
        sharePrivateKeyEnc: manager._libSodium.to_base64(sharePrivateKeyEnc),
        sharePrivateKeyNonce: manager._libSodium.to_base64(
          manager._keyStore.sharePrivateKeyNonce
        ),
      },
    };
  }

  private _genRandomBuffer(length: number): Uint8Array {
    const buffer = new Uint8Array(length);
    window.crypto.getRandomValues(buffer);
    return buffer;
  }

  private _deriveMasterKey(password: string, salt: Uint8Array) {
    if (!this._libSodium) throw new Error('KeyStore is not initialized');

    // const salt = this._genRandomBuffer(this._libSodium.crypto_pwhash_SALTBYTES);

    const result = this._libSodium.crypto_pwhash(
      32,
      password,
      salt,
      this._libSodium.crypto_pwhash_OPSLIMIT_MODERATE,
      this._libSodium.crypto_pwhash_MEMLIMIT_MODERATE,
      this._libSodium.crypto_pwhash_ALG_DEFAULT
    );

    this._keyStore.masterKey = result;
    this._keyStore.masterKeySalt = salt;
  }

  private _deriveAuthKey() {
    if (!this._libSodium) throw new Error('KeyStore is not initialized');

    // TODO: Is this the same or not?
    // this._keyStore.authKey = this._libSodium.crypto_kdf_derive_from_key(
    //   32,
    //   0,
    //   '',
    //   this._keyStore.masterKey
    // );
    this._keyStore.authKey = this._libSodium.crypto_hash(
      this._keyStore.masterKey
    );
  }

  setShareKey(pub: string, privateEnc: string, nonce: string) {
    this._keyStore.sharePrivateKeyNonce = this._libSodium.from_base64(nonce);

    this._keyStore.shareKeyPair = {
      keyType: 'curve25519',
      publicKey: this._libSodium.from_base64(pub),
      privateKey: this._libSodium.crypto_secretbox_open_easy(
        this._libSodium.from_base64(privateEnc),
        this._keyStore.sharePrivateKeyNonce,
        this._keyStore.masterKey
      ),
    };
  }

  getAuthKey(): string {
    return this._libSodium.to_base64(this._keyStore.authKey);
  }

  getMasterKey(): string {
    return this._libSodium.to_base64(this._keyStore.masterKey);
  }
}
