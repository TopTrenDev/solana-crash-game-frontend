export default class ConvertWrapper {
  private static instance: ConvertWrapper;

  public static getInstance(): ConvertWrapper {
    if (!ConvertWrapper.instance) {
      ConvertWrapper.instance = new ConvertWrapper();
    }
    return ConvertWrapper.instance;
  }

  public arrayBufferToUtf8(arrayBuffer: ArrayBuffer): string {
    return new TextDecoder('utf-8').decode(arrayBuffer);
  }

  public base64StringToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  public convertPemToBinary2(pem: string): string {
    const lines = pem.split('\n');
    let encoded = '';
    for (const line of lines) {
      if (
        line.trim().length > 0 &&
        !line.includes('-BEGIN RSA PRIVATE KEY-') &&
        !line.includes('-BEGIN RSA PUBLIC KEY-') &&
        !line.includes('-BEGIN PRIVATE KEY-') &&
        !line.includes('-BEGIN PUBLIC KEY-') &&
        !line.includes('-END PUBLIC KEY-') &&
        !line.includes('-END RSA PRIVATE KEY-') &&
        !line.includes('-END PRIVATE KEY-') &&
        !line.includes('-END RSA PUBLIC KEY-')
      ) {
        encoded += line.trim();
      }
    }
    return encoded;
  }

  public str2abUtf8(myString: string): Uint8Array {
    return new TextEncoder().encode(myString);
  }

  public arrayBufferToBase64String(arrayBuffer: ArrayBuffer): string {
    const byteArray = new Uint8Array(arrayBuffer);
    let byteString = '';
    for (let i = 0; i < byteArray.byteLength; i++) {
      byteString += String.fromCharCode(byteArray[i]);
    }
    return btoa(byteString);
  }
}
