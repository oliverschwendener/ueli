export class InputOutputCombination {
    public input: any;
    public output: any;
}

export const validWindowsFilePaths = [
    "C:\\Program Files (x86)\\Some Folder\\some-file.ext",
    "C:\\temp",
    "D:\\hello\\spaces are allowed\\and.this.is.also.valid",
];

export const invalidWindowsFilePaths = [
    "\\Program Files",
    "Program Files",
    "C:Program Files",
    "C::\\Program Files",
];

export const validMacOsFilePaths = [
    "/",
    "/Users/Hansueli",
    "/Spaces are allowed as well",
    "/and.this.is/valid-as/well",
];

export const invalidMacOsFilePaths = [
    "\\this is invalid",
    "Applications/Gugus",
    "-/Gugus",
];
