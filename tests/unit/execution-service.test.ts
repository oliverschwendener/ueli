import { expect } from "chai";
import { WindowsFilePathValidator, MacOsFilePathValidator } from "./../../src/ts/validators/file-path-validator";

describe("execution-service", () => {
    describe("windows file path validator", () => {
        describe("isFilePath", () => {
            let validator = new WindowsFilePathValidator();

            it("should return true when passing in a valid file path", () => {
                let validFilePaths = [
                    "C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs\\SomeDumb\\Shit.lnk",
                    "D:\\some-shit",
                    "Z:\\spaces are allowed in windows file paths",
                    "x:\\CaseIs Ignored.\\abc"
                ];

                for (let validFilePath of validFilePaths) {
                    let actual = validator.isFilePath(validFilePath);
                    expect(actual).to.be.true;
                }
            });

            it("should return false when passing in an invalid file path", () => {
                let validFilePaths = [
                    "this is not a filepath",
                    "C\\:gugus",
                    "\\this is shit",
                    "ezr:reload",
                    "http://github.com/some-shit",
                    "www.google.com"
                ];

                for (let validFilePath of validFilePaths) {
                    let actual = validator.isFilePath(validFilePath);
                    expect(actual).to.be.false;
                }
            });
        });
    });

    describe("macos file path validator", () => {
        describe("isFilePath", () => {
            let validator = new MacOsFilePathValidator();

            it("should return true when passing in a valid file path", () => {
                let validFilePaths = [
                    "/Applications",
                    "/applications",
                    "/this/is/a/valid/filepath.app",
                    "/some-shit/",
                    "/spaces are allowed/arent they"
                ];

                for (let validFilePath of validFilePaths) {
                    let actual = validator.isFilePath(validFilePath);
                    expect(actual).to.be.true;
                }
            });

            it("should return false when passing in an invalid file path", () => {
                let validFilePaths = [
                    "this is not a filepath",
                    "this/is/shit",
                    "//bla bla",
                    "ezr:reload",
                    "http://github.com/some-shit",
                    "www.google.com"
                ];

                for (let validFilePath of validFilePaths) {
                    let actual = validator.isFilePath(validFilePath);
                    expect(actual).to.be.false;
                }
            });
        });
    });
});