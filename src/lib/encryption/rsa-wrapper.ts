// src/cryptoUtils.ts
import ConvertWrapper from './convert-wrapper';

const crypto = window.crypto.subtle;
const rsaParams = { name: 'RSA-OAEP', hash: { name: 'SHA-1' } };

export default class RSAWrapper {
  private static instance: RSAWrapper;
  private converterWrapper: ConvertWrapper;

  public static getInstance(): RSAWrapper {
    if (!RSAWrapper.instance) {
      RSAWrapper.instance = new RSAWrapper();
    }
    return RSAWrapper.instance;
  }

  constructor() {
    this.converterWrapper = ConvertWrapper.getInstance();
  }

  async importPublicKey(keyInPemFormat: string): Promise<CryptoKey> {
    const key = this.converterWrapper.convertPemToBinary2(keyInPemFormat);
    const keyBuffer = this.converterWrapper.base64StringToArrayBuffer(key);
    return crypto.importKey('spki', keyBuffer, rsaParams, false, ['encrypt']);
  }

  async importPrivateKey(keyInPemFormat: string): Promise<CryptoKey> {
    const key = this.converterWrapper.convertPemToBinary2(keyInPemFormat);
    const keyBuffer = this.converterWrapper.base64StringToArrayBuffer(key);
    return crypto.importKey('pkcs8', keyBuffer, rsaParams, false, ['decrypt']);
  }

  async publicEncrypt(
    keyInPemFormat: string,
    message: string
  ): Promise<string> {
    const key = await this.importPublicKey(keyInPemFormat);
    const encrypted = await crypto.encrypt(
      rsaParams,
      key,
      this.converterWrapper.str2abUtf8(message)
    );
    return this.converterWrapper.arrayBufferToBase64String(encrypted);
  }

  async privateDecrypt(
    keyInPemFormat: string,
    encryptedBase64Message: string
  ): Promise<string> {
    const key = await this.importPrivateKey(keyInPemFormat);
    const decrypted = await crypto.decrypt(
      rsaParams,
      key,
      this.converterWrapper.base64StringToArrayBuffer(encryptedBase64Message)
    );
    return this.converterWrapper.arrayBufferToUtf8(decrypted);
  }
}
