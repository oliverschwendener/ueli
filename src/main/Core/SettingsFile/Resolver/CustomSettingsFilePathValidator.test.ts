import type { FileSystemUtility } from "@Core/FileSystemUtility";
import { describe, expect, it, vi } from "vitest";
import { CustomSettingsFilePathValidator } from "./CustomSettingsFilePathValidator";

describe(CustomSettingsFilePathValidator, () => {
    describe(CustomSettingsFilePathValidator.prototype.validate, () => {
        it("should return false if the file does not exist", () => {
            const existsSyncMock = vi.fn().mockReturnValue(false);

            const fileSystemUtility = <FileSystemUtility>{ existsSync: (f) => existsSyncMock(f) };

            const customSettingsFilePathValidator = new CustomSettingsFilePathValidator(fileSystemUtility);

            expect(customSettingsFilePathValidator.validate("non-existing-file.json")).toBe(false);
            expect(existsSyncMock).toHaveBeenCalledWith("non-existing-file.json");
        });

        it("should return false if the file is not a valid JSON", () => {
            const existsSyncMock = vi.fn().mockReturnValue(true);

            const readJsonFileSyncMock = vi.fn().mockImplementation(() => {
                throw new Error("Invalid JSON");
            });

            const fileSystemUtility = <FileSystemUtility>{
                existsSync: (f) => existsSyncMock(f),
                readJsonFileSync: (f) => readJsonFileSyncMock(f),
            };

            const customSettingsFilePathValidator = new CustomSettingsFilePathValidator(fileSystemUtility);

            expect(customSettingsFilePathValidator.validate("invalid-json-file.json")).toBe(false);

            expect(existsSyncMock).toHaveBeenCalledWith("invalid-json-file.json");
            expect(readJsonFileSyncMock).toHaveBeenCalledWith("invalid-json-file.json");
        });

        it("should return true if the file exists and is a valid JSON", () => {
            const existsSyncMock = vi.fn().mockReturnValue(true);
            const readJsonFileSyncMock = vi.fn().mockReturnValue({});

            const fileSystemUtility = <FileSystemUtility>{
                existsSync: (f) => existsSyncMock(f),
                readJsonFileSync: (f) => readJsonFileSyncMock(f),
            };

            const customSettingsFilePathValidator = new CustomSettingsFilePathValidator(fileSystemUtility);

            expect(customSettingsFilePathValidator.validate("invalid-json-file.json")).toBe(true);

            expect(existsSyncMock).toHaveBeenCalledWith("invalid-json-file.json");
            expect(readJsonFileSyncMock).toHaveBeenCalledWith("invalid-json-file.json");
        });
    });
});
