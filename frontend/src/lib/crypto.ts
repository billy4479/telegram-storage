import * as argon2 from 'argon2-browser'; // TODO: Fix this import
import sha256 from 'crypto-js/sha256';
import aes from 'crypto-js/aes';
import 'crypto-js/core';
import Base64 from 'crypto-js/enc-base64';

console.log(argon2);

const compat = {
  from(i: Uint8Array): CryptoJS.lib.WordArray {
    return CryptoJS.lib.WordArray.create(Array.from(i));
  },
  to(i: CryptoJS.lib.WordArray): Uint8Array {
    return Uint8Array.from(i.words);
  },
};

type NumArray = CryptoJS.lib.WordArray;

export class KeyStore {
  masterKey: NumArray | null;
  encKey: NumArray | null;
  encryptedEncKey: NumArray | null;
  authKey: NumArray | null;

  async deriveMasterKey(password: string) {
    const randBuffer = new Uint8Array(32);
    window.crypto.getRandomValues(randBuffer);
    const result = await argon2.hash({
      type: argon2.ArgonType.Argon2id,
      pass: password,
      salt: randBuffer,
      time: 1,
      mem: 64 * 1024,
      parallelism: 4,
      hashLen: 32,
    });
    this.masterKey = compat.from(result.hash);
  }

  generateEncryptionKey() {
    const buffer = new Uint8Array(32);
    window.crypto.getRandomValues(buffer);
    this.encKey = compat.from(buffer);
  }

  encryptEncryptionKey() {
    if (!this.encKey || !this.masterKey)
      throw new Error(
        'EncKey and MasterKey are required to run encryptEncryptionKey'
      );

    this.encryptedEncKey = aes.encrypt(this.encKey, this.masterKey).ciphertext;
  }

  decryptEncryptionKey() {
    if (!this.encryptedEncKey || !this.masterKey)
      throw new Error(
        'EncryptedEncKey and MasterKey are required to run decryptEncryptionKey'
      );

    this.encKey = aes.decrypt(this.encryptedEncKey.toString(), this.masterKey);
  }

  deriveAuthKey() {
    if (!this.masterKey)
      throw new Error('MasterKey is required to run deriveAuthKey');

    this.authKey = sha256(this.masterKey);
  }

  toBase64(input: NumArray): string {
    return Base64.stringify(input);
  }

  toUint8Array(input: NumArray): Uint8Array {
    return compat.to(input);
  }
}

export const keyStore = new KeyStore();
