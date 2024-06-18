import ConvertWrapper from './convert-wrapper';

const crypto = window.crypto.subtle;

export default class AESWrapper {
  private converterWrapper: ConvertWrapper;
  private static instance: AESWrapper;

  public static getInstance(): AESWrapper {
    if (!AESWrapper.instance) {
      AESWrapper.instance = new AESWrapper();
    }
    return AESWrapper.instance;
  }

  constructor() {
    this.converterWrapper = ConvertWrapper.getInstance();
  }

  async importPublicKey(key: string): Promise<CryptoKey> {
    return crypto.importKey(
      'raw',
      this.converterWrapper.base64StringToArrayBuffer(key),
      { name: 'AES-CBC' },
      false,
      ['encrypt', 'decrypt']
    );
  }

  separateVectorFromData(data: string): { iv: string; message: string } {
    const iv = data.slice(-24);
    const message = data.substring(0, data.length - 24);
    return { iv, message };
  }

  getMessageWithIv(message: ArrayBuffer, iv: Uint8Array): string {
    return (
      this.converterWrapper.arrayBufferToBase64String(message) +
      this.converterWrapper.arrayBufferToBase64String(iv.buffer)
    );
  }

  async encryptMessage(key: string, message: string): Promise<string> {
    const iv = window.crypto.getRandomValues(new Uint8Array(16));
    const cryptoKey = await this.importPublicKey(key);

    const encrypted = await crypto.encrypt(
      { name: 'AES-CBC', iv },
      cryptoKey,
      this.converterWrapper.str2abUtf8(message)
    );

    return this.getMessageWithIv(encrypted, iv);
  }

  async decryptMessage(key: string, message: string): Promise<string> {
    const data = this.separateVectorFromData(message);
    const cryptoKey = await this.importPublicKey(key);

    const decrypted = await crypto.decrypt(
      {
        name: 'AES-CBC',
        iv: this.converterWrapper.base64StringToArrayBuffer(data.iv)
      },
      cryptoKey,
      this.converterWrapper.base64StringToArrayBuffer(data.message)
    );

    return this.converterWrapper.arrayBufferToUtf8(decrypted);
  }
}
