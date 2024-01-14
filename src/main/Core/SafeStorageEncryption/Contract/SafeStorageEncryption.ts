export interface SafeStorageEncryption {
    encryptString(plainText: string): string;
    decryptString(encryptedText: string): string;
}
