import { WindowsAdminFilePathExecutionArgumentValidator } from "../../../ts/execution-argument-validators/windows-admin-file-path-execution-argument-validator";
import { validMacOsFilePaths } from "../test-helpers";

describe(WindowsAdminFilePathExecutionArgumentValidator.name, () => {
    const allowedFileExtensions = [
        ".lnk",
        ".exe",
    ];

    const validator = new WindowsAdminFilePathExecutionArgumentValidator(allowedFileExtensions);
    const baseFilePath = "C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs\\Google Chrome";

    const disallowedFileExtensions = [
        "",
        ".pdf",
        ".txt",
        ".bin",
        ".mp3",
        ".mp4",
    ];

    describe(validator.isValidForExecution.name, () => {
        it("should return true when passing in a valid windows file path with an allowed file extension", () => {
            const expected = true;

            allowedFileExtensions.forEach((allowedFileExtension) => {
                const filePath = `${baseFilePath}${allowedFileExtension}`;
                const actual = validator.isValidForExecution(filePath);
                expect(actual).toBe(expected);
            });
        });

        it("should return fals when passing in a valid windows file path with an unallowed file extension", () => {
            const expected = false;

            disallowedFileExtensions.forEach((allowedFileExtension) => {
                const filePath = `${baseFilePath}${allowedFileExtension}`;
                const actual = validator.isValidForExecution(filePath);
                expect(actual).toBe(expected);
            });
        });

        it("should return false when passing in an invalid windows file path", () => {
            const expected = false;
            validMacOsFilePaths.forEach((validMacOsFilePath) => {
                const actual = validator.isValidForExecution(validMacOsFilePath);
                expect(actual).toBe(expected);
            });
        });

        it("should return false when passing in an invalid windows file path with an allowed file extension", () => {
            const expected = false;

            validMacOsFilePaths.forEach((validMacOsFilePath) => {
                allowedFileExtensions.forEach((allowedFileExtension) => {
                    const filePath = `${validMacOsFilePath}${allowedFileExtension}`;
                    const actual = validator.isValidForExecution(filePath);
                    expect(actual).toBe(expected);
                });
            });
        });
    });
});
