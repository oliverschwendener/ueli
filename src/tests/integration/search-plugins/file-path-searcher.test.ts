import { FilePathSearcher } from "../../../ts/searcher/file-path-searcher";
import { testIconSet } from "../../../ts/icon-sets/test-icon-set";
import { mkdirSync, rmdirSync, writeFileSync, unlinkSync } from "fs";
import { join, basename } from "path";
import { FilePathDescriptionBuilder } from "../../../ts/builders/file-path-description-builder";

const testSearchEngineThreshold = 0.4; // same as default config;
const testSearchEngineLimit = 8;
const searcher = new FilePathSearcher(testSearchEngineThreshold, testSearchEngineLimit, testIconSet);

describe(FilePathSearcher.name, (): void => {
    it("should block other searchers", (): void => {
        const actual = searcher.blockOthers;
        expect(actual).toBe(true);
    });

    describe(searcher.getSearchResult.name, (): void => {
        const testFolder = join(__dirname, "test-folder");

        const testFiles = [
            "test-file-abcd",
            "test-file-abcdef",
            "test-file-abc",
        ];

        const subFolders = ["sub-folder-1", "sub-folder-2", "sub-folder-3"];

        beforeEach(() => {
            mkdirSync(testFolder);

            for (const testFile of testFiles) {
                writeFileSync(join(testFolder, testFile), "", "utf-8");
            }

            for (const subFolder of subFolders) {
                mkdirSync(join(testFolder, subFolder));
            }
        });

        afterEach(() => {
            for (const testFile of testFiles) {
                unlinkSync(join(testFolder, testFile));
            }

            for (const subFolder of subFolders) {
                rmdirSync(join(testFolder, subFolder));
            }

            rmdirSync(testFolder);
        });

        it("should return all files and folders when passing in a file path to an existing folder", (): void => {
            const userInput = testFolder;
            const actual = searcher.getSearchResult(userInput);
            const expected = testFiles.length + subFolders.length;
            expect(actual.length).toBe(expected);
        });

        it("should return a single entry when passing in a file path to an existing file", (): void => {
            const userInput = join(testFolder, testFiles[0]);
            const actual = searcher.getSearchResult(userInput);
            expect(actual.length).toBe(1);
            expect(actual[0].description).toBe(FilePathDescriptionBuilder.buildFilePathDescription(userInput));
            expect(actual[0].executionArgument).toBe(userInput);
            expect(actual[0].icon).toBe(testIconSet.fileIcon);
            expect(actual[0].name).toBe(basename(userInput));
            expect(actual[0].searchable.length).toBe(1);
            expect(actual[0].searchable[0]).toBe(basename(userInput));
        });

        it("should sort the search results", (): void => {
            const userInput = join(testFolder, "abc");
            const actual = searcher.getSearchResult(userInput);
            expect(actual.length).toBe(3);
            expect(basename(actual[0].executionArgument)).toBe(testFiles.sort()[0]);
            expect(basename(actual[1].executionArgument)).toBe(testFiles.sort()[1]);
            expect(basename(actual[2].executionArgument)).toBe(testFiles.sort()[2]);
        });

        it("should return an empty array when passing in a file path to a file that does not exist", (): void => {
            const userInput = join(testFolder, "non-existing-folder", "non-existing-file");
            const actual = searcher.getSearchResult(userInput);
            expect(actual.length).toBe(0);
        });
    });
});
