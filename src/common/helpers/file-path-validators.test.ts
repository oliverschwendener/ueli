import { isValidWindowsFilePath, isValidMacOsFilePath } from "./file-path-validators";

const validWindowsFilePaths = [
    "C:\\Program Files (x86)\\Some Folder\\some-file.ext",
    "C:\\temp",
    "D:\\hello\\spaces are allowed\\and.this.is.also.valid",
    "C:/Users/Oliver",
    "\\\\Share\\My Folder",
];

const invalidWindowsFilePaths = ["Program Files", "C:Program Files", "C::\\Program Files"];

const validMacOsFilePaths = ["/", "/Users/Hansueli", "/Spaces are allowed as well", "/and.this.is/valid-as/well"];

const invalidMacOsFilePaths = ["\\this is invalid", "Applications/Gugus", "-/Gugus"];

describe(isValidWindowsFilePath.name, () => {
    it("should return true if given string is a valid file path", () => {
        validWindowsFilePaths.forEach((validWindowsFilePath) => {
            const actual = isValidWindowsFilePath(validWindowsFilePath);
            expect(actual).toBe(true);
        });
    });

    it("should return false if given string is an invalid file path", () => {
        invalidWindowsFilePaths.forEach((invalidWindowsFilePath) => {
            const actual = isValidWindowsFilePath(invalidWindowsFilePath);
            expect(actual).toBe(false);
        });
    });
});

describe(isValidMacOsFilePath.name, () => {
    it("should return true if given string is a valid file path", () => {
        validMacOsFilePaths.forEach((validMacOsFilePath) => {
            const actual = isValidMacOsFilePath(validMacOsFilePath);
            expect(actual).toBe(true);
        });
    });

    it("should return false if given string is an invalid file path", () => {
        invalidMacOsFilePaths.forEach((invalidMacOsFilePath) => {
            const actual = isValidMacOsFilePath(invalidMacOsFilePath);
            expect(actual).toBe(false);
        });
    });
});
