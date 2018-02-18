import { expect } from "chai";
import { FilePathExecutionArgumentValidator } from "../../../src/ts/execution-argument-validators/file-path-execution-argument-validator";
import { validWindowsFilePaths, validMacOsFilePaths, invalidWindowsFilePaths, invalidMacOsFilePaths } from "../test-helpers";
import { Injector, OperatingSystem } from "../../../src/ts/injector";

describe(FilePathExecutionArgumentValidator.name, (): void => {
    let validator = new FilePathExecutionArgumentValidator();

    describe(validator.isValidForExecution.name, (): void => {
        let validInputs = Injector.getCurrentOperatingSystem() === OperatingSystem.Windows ? validWindowsFilePaths : validMacOsFilePaths;
        let invalidInputs = Injector.getCurrentOperatingSystem() === OperatingSystem.Windows ? invalidWindowsFilePaths : invalidMacOsFilePaths;

        it("should return true when passing in a valid argument", (): void => {
            for (let validInput of validInputs) {
                let actual = validator.isValidForExecution(validInput);
                expect(actual).to.be.true;
            }
        });

        it("should return false when passing in an invalid argument", (): void => {
            for (let invalidInput of invalidInputs) {
                let actual = validator.isValidForExecution(invalidInput);
                expect(actual).to.be.false;
            }
        });
    });
});