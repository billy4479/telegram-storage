import { newDecryptionStream } from './decryptionStream';
import { newEncryptionStream } from './encryptionStream';

type LibSodium =
  typeof import('/home/billy/code/telegram-storage/frontend/node_modules/@types/libsodium-wrappers/index');

export class KeyStore {
  masterKey: Uint8Array;
  masterKeySalt: Uint8Array;

  shareKeyPair: {
    priv: Uint8Array;
    pub: Uint8Array;
  };
  sharePrivateKeyNonce: Uint8Array;
}

export interface CreateUserKeys {
  masterKeySalt: string;
  authKey: string;

  sharePublicKey: string;
  sharePrivateKeyEnc: string;
  sharePrivateKeyNonce: string;
}

export interface EncryptFileResult {
  data: Blob;
  header: string;
  key: {
    keyEnc: string;
    nonce: string;
  };
}

let cryptoManager: CryptoManager | null = null;

export function getCryptoManager() {
  return cryptoManager;
}

const CHUNK_SIZE = 8 * 1024;
// const CHUNK_SIZE = 4 * 1024 * 1024;

export class CryptoManager {
  private _initPromise: Promise<void>;
  private _libSodium: LibSodium | null;

  private _keyStore: KeyStore;

  private constructor() {
    this._libSodium = null;
    this._keyStore = new KeyStore();
    this._initPromise = (async (): Promise<void> => {
      console.log('Initializing LibSodium');

      const sodium = (await import('libsodium-wrappers')).default;
      await sodium.ready;
      this._libSodium = sodium;

      console.log('LibSodium is initialized');
    })();
  }

  private get initialized(): Promise<CryptoManager> {
    if (this._libSodium) return Promise.resolve(this);

    return this._initPromise.then(() => {
      return this;
    });
  }

  static async fromMasterKey(masterKey: string) {
    cryptoManager = await new CryptoManager().initialized;
    cryptoManager._keyStore.masterKey =
      cryptoManager._libSodium.from_base64(masterKey);
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
    return cryptoManager;
  }

  static async createUser(password: string): Promise<{
    manager: CryptoManager;
    keys: CreateUserKeys;
  }> {
    // if (!this._libSodium) throw new Error('KeyStore is not initialized');

    const manager = await new CryptoManager().initialized;

    const salt = manager._libSodium.randombytes_buf(
      manager._libSodium.crypto_pwhash_SALTBYTES
    );

    manager._deriveMasterKey(password, salt);

    const keyPair = manager._libSodium.crypto_box_keypair();
    manager._keyStore.shareKeyPair = {
      priv: keyPair.privateKey,
      pub: keyPair.publicKey,
    };

    manager._keyStore.sharePrivateKeyNonce = manager._libSodium.randombytes_buf(
      manager._libSodium.crypto_secretbox_NONCEBYTES
    );
    const sharePrivateKeyEnc = manager._libSodium.crypto_secretbox_easy(
      manager._keyStore.shareKeyPair.priv,
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
        authKey: manager._libSodium.to_base64(manager._deriveAuthKey()),
        sharePublicKey: manager._libSodium.to_base64(
          manager._keyStore.shareKeyPair.pub
        ),
        sharePrivateKeyEnc: manager._libSodium.to_base64(sharePrivateKeyEnc),
        sharePrivateKeyNonce: manager._libSodium.to_base64(
          manager._keyStore.sharePrivateKeyNonce
        ),
      },
    };
  }

  private _deriveMasterKey(password: string, salt: Uint8Array) {
    if (!this._libSodium) throw new Error('KeyStore is not initialized');

    console.log('Started MasterKey derivation');

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

    console.log('MasterKey derived successfully');
  }

  private _deriveAuthKey(): Uint8Array {
    if (!this._libSodium) throw new Error('KeyStore is not initialized');

    // TODO: Is this the same or not?
    // this._keyStore.authKey = this._libSodium.crypto_kdf_derive_from_key(
    //   32,
    //   0,
    //   '',
    //   this._keyStore.masterKey
    // );
    return this._libSodium.crypto_hash(this._keyStore.masterKey);
  }

  setShareKey(pub: string, privateEnc: string, nonce: string) {
    this._keyStore.sharePrivateKeyNonce = this._libSodium.from_base64(nonce);

    this._keyStore.shareKeyPair = {
      pub: this._libSodium.from_base64(pub),
      priv: this._libSodium.crypto_secretbox_open_easy(
        this._libSodium.from_base64(privateEnc),
        this._keyStore.sharePrivateKeyNonce,
        this._keyStore.masterKey
      ),
    };
  }

  async encryptFile(
    inputStream: ReadableStream<Uint8Array>
  ): Promise<EncryptFileResult> {
    const s = this._libSodium;
    const key = s.crypto_secretstream_xchacha20poly1305_keygen();
    const { state, header } =
      s.crypto_secretstream_xchacha20poly1305_init_push(key);

    const encryptionStream = newEncryptionStream(
      inputStream,
      CHUNK_SIZE,
      s,
      state
    );

    const nonce = s.randombytes_buf(s.crypto_secretbox_NONCEBYTES);
    const keyEnc = s.crypto_secretbox_easy(
      key,
      nonce,
      this._keyStore.masterKey
    );

    return {
      data: await new Response(encryptionStream).blob(),
      header: s.to_base64(header),
      key: {
        keyEnc: s.to_base64(keyEnc),
        nonce: s.to_base64(nonce),
      },
    };
  }

  async decryptFile(
    inputStream: ReadableStream<Uint8Array>,
    header: string,
    keyEnc: string,
    nonce: string
  ): Promise<Blob> {
    const s = this._libSodium;

    const key = s.crypto_secretbox_open_easy(
      s.from_base64(keyEnc),
      s.from_base64(nonce),
      this._keyStore.masterKey
    );

    const state = s.crypto_secretstream_xchacha20poly1305_init_pull(
      s.from_base64(header),
      key
    );

    const decryptionStream = newDecryptionStream(
      inputStream,
      CHUNK_SIZE,
      s,
      state
    );

    return new Response(decryptionStream).blob();
  }

  getAuthKey(): string {
    return this._libSodium.to_base64(this._deriveAuthKey());
  }

  getMasterKey(): string {
    return this._libSodium.to_base64(this._keyStore.masterKey);
  }
}
