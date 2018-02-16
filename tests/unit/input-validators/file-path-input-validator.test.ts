import { expect } from "chai";
import { FilePathInputValidator } from "../../../src/ts/input-validators/file-path-input-validator";
import { Injector, OperatingSystem } from "../../../src/ts/injector";

describe(FilePathInputValidator.name, (): void => {
    let validator = new FilePathInputValidator();

    let validWindowsFilePaths = [
        "C:\\Program Files (x86)\\Some Folder\\some-file.ext",
        "C:\\temp",
        "D:\\hello\\spaces are allowed\\and.this.is.also.valid"
    ];

    let invalidWindowsFilePaths = [
        "\\Program Files",
        "Program Files",
        "C:Program Files",
        "C::\\Program Files"
    ];

    let validMacOsFilePaths = [
        "/",
        "/Users/Hansueli",
        "/Spaces are allowed as well",
        "/and.this.is/valid-as/well"
    ];

    let invalidMacOsFilePaths = [
        "\\this is invalid",
        "Applications/Gugus",
        "-/Gugus"
    ];

    describe(validator.isValidForSearchResults.name, (): void => {
        let validInputs = Injector.getCurrentOperatingSystem() === OperatingSystem.Windows ? validWindowsFilePaths : validMacOsFilePaths;
        let invalidInputs = Injector.getCurrentOperatingSystem() === OperatingSystem.Windows ? invalidWindowsFilePaths : invalidMacOsFilePaths;

        it("should return true when passing in a valid argument", (): void => {
            for (let validInput of validInputs) {
                let actual = validator.isValidForSearchResults(validInput);
                expect(actual).to.be.true;
            }
        });

        it("should return false when passing in an invalid argument", (): void => {
            for (let invalidInput of invalidInputs) {
                let actual = validator.isValidForSearchResults(invalidInput);
                expect(actual).to.be.false;
            }
        });
    });
});