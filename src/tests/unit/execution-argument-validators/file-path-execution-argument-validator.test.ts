import { FilePathExecutionArgumentValidator } from "../../../ts/execution-argument-validators/file-path-execution-argument-validator";
import { Injector } from "../../../ts/injector";
import { OperatingSystem } from "../../../ts/operating-system";
import { invalidMacOsFilePaths, invalidWindowsFilePaths, validMacOsFilePaths, validWindowsFilePaths } from "../test-helpers";
import { platform } from "os";

describe(FilePathExecutionArgumentValidator.name, (): void => {
    const validator = new FilePathExecutionArgumentValidator();

    describe(validator.isValidForExecution.name, (): void => {
        const validInputs = platform() === "win32"
            ? validWindowsFilePaths
            : validMacOsFilePaths;

        const invalidInputs = platform() === "win32"
            ? invalidWindowsFilePaths
            : invalidMacOsFilePaths;

        it("should return true when passing in a valid argument", (): void => {
            for (const validInput of validInputs) {
                const actual = validator.isValidForExecution(validInput);
                expect(actual).toBe(true);
            }
        });

        it("should return false when passing in an invalid argument", (): void => {
            for (const invalidInput of invalidInputs) {
                const actual = validator.isValidForExecution(invalidInput);
                expect(actual).toBe(false);
            }
        });
    });
});
