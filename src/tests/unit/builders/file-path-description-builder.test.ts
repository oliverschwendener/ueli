import { FilePathDescriptionBuilder } from "../../../ts/builders/file-path-description-builder";
import { platform } from "os";
import { UeliHelpers } from "../../../ts/helpers/ueli-helpers";

const windowsFilePath = "C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs\\Adobe\\Adobe Lightroom.lnk";
const windowsResult = `Adobe ${UeliHelpers.searchResultDescriptionSeparator} Adobe Lightroom.lnk`;

const windowsFilePathWithNoParentDirectory = "C:\\ProgramData";
const windowsResultWithNoParentDirectory = "ProgramData";

const macOsFilePath = "/Applications/Adobe/Adobe Lightroom.app";
const macOsResult = `Adobe ${UeliHelpers.searchResultDescriptionSeparator} Adobe Lightroom.lnk`;

const macOsFilePathWithNoParentDirectory = "/Applications";
const macOsResultWithNoParentDirectory = "Applications";

const currentPlatform = platform();

describe(FilePathDescriptionBuilder.name, (): void => {
    describe(FilePathDescriptionBuilder.buildFilePathDescription.name, (): void => {
        it("should build the search result description from a file path correctly", (): void => {
            const filePath = currentPlatform === "win32"
                ? windowsFilePath
                : macOsFilePath;

            const expected = currentPlatform === "win32"
                ? windowsResult
                : macOsResult;

            const actual = FilePathDescriptionBuilder.buildFilePathDescription(filePath);

            expect(actual).toBe(expected);
        });

        it("should build the search result description correctly when file path has no parent directory", (): void => {
            const filePath = currentPlatform === "win32"
                ? windowsFilePathWithNoParentDirectory
                : macOsFilePathWithNoParentDirectory;

            const expected = currentPlatform === "win32"
                ? windowsResultWithNoParentDirectory
                : macOsResultWithNoParentDirectory;

            const actual = FilePathDescriptionBuilder.buildFilePathDescription(filePath);

            expect(actual).toBe(expected);
        });
    });
});
