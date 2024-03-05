/**
 * Offers methods to encrypt and decrypt strings.
 */
export interface SafeStorageEncryption {
    /**
     * Encrypts a string. If encryption is not available on the system, the plain text is returned.
     * @param plainText The string to encrypt.
     * @returns The encrypted string.
     */
    encryptString(plainText: string): string;

    /**
     * Decrypts a string. If encryption is not available on the system, the encrypted text is returned.
     * @param encryptedText The string to decrypt.
     * @returns The decrypted string.
     */
    decryptString(encryptedText: string): string;
}
