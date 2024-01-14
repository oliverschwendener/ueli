import type { SafeStorage } from "electron";
import type { SafeStorageEncryption as SafeStorageEncryptionInterface } from "./Contract";

export class SafeStorageEncryption implements SafeStorageEncryptionInterface {
    private static readonly BufferEncoding: BufferEncoding = "base64";

    public constructor(private readonly safeStorage: SafeStorage) {}

    public encryptString(plainText: string): string {
        return this.safeStorage.isEncryptionAvailable()
            ? this.safeStorage.encryptString(plainText).toString(SafeStorageEncryption.BufferEncoding)
            : plainText;
    }

    public decryptString(encryptedText: string): string {
        return this.safeStorage.isEncryptionAvailable()
            ? this.safeStorage.decryptString(Buffer.from(encryptedText, SafeStorageEncryption.BufferEncoding))
            : encryptedText;
    }
}
