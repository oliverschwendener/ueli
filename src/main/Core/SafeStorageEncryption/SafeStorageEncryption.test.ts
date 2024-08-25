import type { SafeStorage } from "electron";
import { describe, expect, it, vi } from "vitest";
import { SafeStorageEncryption } from "./SafeStorageEncryption";

describe(SafeStorageEncryption, () => {
    it("should return the encrypted string when encryption is available", () => {
        const buffer = Buffer.from("encrypted text");
        const encryptStringMock = vi.fn().mockReturnValue(buffer);

        const safeStorageEncryption = new SafeStorageEncryption(<SafeStorage>{
            isEncryptionAvailable: () => true,
            encryptString: (plainText) => encryptStringMock(plainText),
        });

        expect(safeStorageEncryption.encryptString("plain text")).toBe(buffer.toString("base64"));
        expect(encryptStringMock).toHaveBeenCalledWith("plain text");
    });

    it("should return the plain text when encrypting if encryption is not available", () => {
        const safeStorageEncryption = new SafeStorageEncryption(<SafeStorage>{ isEncryptionAvailable: () => false });
        expect(safeStorageEncryption.encryptString("plain text")).toBe("plain text");
    });

    it("should return the decrypted string when encryption is available", () => {
        const decryptStringMock = vi.fn().mockReturnValue("plain text");

        const safeStorageEncryption = new SafeStorageEncryption(<SafeStorage>{
            isEncryptionAvailable: () => true,
            decryptString: (encryptedBuffer) => decryptStringMock(encryptedBuffer),
        });

        expect(safeStorageEncryption.decryptString("encrypted string")).toBe("plain text");
        expect(decryptStringMock).toHaveBeenCalledWith(Buffer.from("encrypted string", "base64"));
    });

    it("should return the plain text when decrypting if encryption is not available", () => {
        const safeStorageEncryption = new SafeStorageEncryption(<SafeStorage>{ isEncryptionAvailable: () => false });
        expect(safeStorageEncryption.decryptString("plain text")).toBe("plain text");
    });
});
