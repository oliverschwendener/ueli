import type { SafeStorage } from "electron";
import type { SafeStorageEncryption as SafeStorageEncryptionInterface } from "./Contract";

export class SafeStorageEncryption implements SafeStorageEncryptionInterface {
    private bufferEncoding: BufferEncoding = "base64";

    public constructor(private readonly safeStorage: SafeStorage) {}

    public encryptString(plainText: string): string {
        const buffer = this.safeStorage.encryptString(plainText);
        return this.bufferToString(buffer);
    }

    public decryptString(encryptedText: string): string {
        return this.safeStorage.decryptString(this.stringToBuffer(encryptedText));
    }

    private stringToBuffer(string: string): Buffer {
        return Buffer.from(string, this.bufferEncoding);
    }

    private bufferToString(buffer: Buffer): string {
        return buffer.toString(this.bufferEncoding);
    }
}
