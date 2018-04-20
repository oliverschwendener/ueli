import { Injector } from "../../../ts/injector";
import { FilePathInputValidator } from "../../../ts/input-validators/file-path-input-validator";
import { OperatingSystem } from "../../../ts/operating-system";
import { platform } from "os";

describe(FilePathInputValidator.name, (): void => {
    const validator = new FilePathInputValidator();

    const validWindowsFilePaths = [
        "C:\\Program Files (x86)\\Some Folder\\some-file.ext",
        "C:\\temp",
        "D:\\hello\\spaces are allowed\\and.this.is.also.valid",
    ];

    const invalidWindowsFilePaths = [
        "\\Program Files",
        "Program Files",
        "C:Program Files",
        "C::\\Program Files",
    ];

    const validMacOsFilePaths = [
        "/",
        "/Users/Hansueli",
        "/Spaces are allowed as well",
        "/and.this.is/valid-as/well",
    ];

    const invalidMacOsFilePaths = [
        "\\this is invalid",
        "Applications/Gugus",
        "-/Gugus",
    ];

    describe(validator.isValidForSearchResults.name, (): void => {
        const validInputs = platform() === "win32"
            ? validWindowsFilePaths
            : validMacOsFilePaths;

        const invalidInputs = platform() === "win32"
            ? invalidWindowsFilePaths
            : invalidMacOsFilePaths;

        it("should return true when passing in a valid argument", (): void => {
            for (const validInput of validInputs) {
                const actual = validator.isValidForSearchResults(validInput);
                expect(actual).toBe(true);
            }
        });

        it("should return false when passing in an invalid argument", (): void => {
            for (const invalidInput of invalidInputs) {
                const actual = validator.isValidForSearchResults(invalidInput);
                expect(actual).toBe(false);
            }
        });
    });
});
