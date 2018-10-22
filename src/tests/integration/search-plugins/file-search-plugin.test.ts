import { FileSearchPlugin } from "../../../ts/search-plugins/file-search-plugin";
import { mkdirSync, writeFileSync, unlinkSync, rmdirSync } from "fs";
import { join } from "path";
import { FileSearchOption } from "../../../ts/file-search-option";
import { testIconSet } from "../../../ts/icon-sets/test-icon-set";

const emptyBlackList: string[] = [];

describe(FileSearchPlugin.name, (): void => {
    const parentFolders = [
        join(__dirname, "test-folder-1"),
        join(__dirname, "test-folder-2"),
        join(__dirname, "test-folder-3"),
    ];

    const subFolders = [
        "sub-folder-1",
        "sub-folder-2",
        "sub-folder-3",
    ];

    const testFiles = [
        "test-file-1",
        "test-file-2",
        "test-file-3",
    ];

    beforeEach((): void => {
        for (const parentFolder of parentFolders) {
            mkdirSync(parentFolder);

            for (const subFolder of subFolders) {
                mkdirSync(join(parentFolder, subFolder));

                for (const testFile of testFiles) {
                    const filePath = join(parentFolder, subFolder, testFile);
                    writeFileSync(filePath, "", "utf-8");
                }
            }

            for (const testFile of testFiles) {
                const filePath = join(parentFolder, testFile);
                writeFileSync(filePath, "", "utf-8");
            }
        }
    });

    afterEach((): void => {
        for (const parentFolder of parentFolders) {
            for (const testFile of testFiles) {
                const filePath = join(parentFolder, testFile);
                unlinkSync(filePath);
            }

            for (const subFolder of subFolders) {
                for (const testFile of testFiles) {
                    const filePath = join(parentFolder, subFolder, testFile);
                    unlinkSync(filePath);
                }

                rmdirSync(join(parentFolder, subFolder));
            }

            rmdirSync(parentFolder);
        }
    });

    describe("getAllItems", (): void => {
        it("should return only top level files and folders if recursive search is set to false", (): void => {
            const recursiveSearch = false;
            const options = parentFolders.map((folder: string): FileSearchOption => {
                return {
                    folderPath: folder,
                    recursive: recursiveSearch,
                };
            });
            const plugin = new FileSearchPlugin(options, testIconSet, emptyBlackList);
            const actual = plugin.getAllItems();
            const actualLength = actual.length;
            const expectedLength = (testFiles.length + subFolders.length) * parentFolders.length;

            expect(actualLength).toBe(expectedLength);
        });

        it("should return all files and folders (recursively) if recursive search is set to true", (): void => {
            const recursiveSearch = true;
            const options = parentFolders.map((folder: string): FileSearchOption => {
                return {
                    folderPath: folder,
                    recursive: recursiveSearch,
                };
            });
            const plugin = new FileSearchPlugin(options, testIconSet, emptyBlackList);
            const actual = plugin.getAllItems();
            const actualLength = actual.length;
            const expectedLength = (parentFolders.length * subFolders.length * testFiles.length) + (parentFolders.length * testFiles.length);

            expect(actualLength).toBe(expectedLength);
        });

        it("all returned items should have name, execution argument and tags set", (): void => {
            const options = parentFolders.map((folder: string): FileSearchOption => {
                return {
                    folderPath: folder,
                    recursive: false,
                };
            });
            const plugin = new FileSearchPlugin(options, testIconSet, emptyBlackList);
            const actual = plugin.getAllItems();

            for (const item of actual) {
                expect(item.name.length).toBeGreaterThan(0);
                expect(item.executionArgument.length).toBeGreaterThan(0);
            }
        });

        it("should set the right icon", (): void => {
            const options = parentFolders.map((folder: string): FileSearchOption => {
                return {
                    folderPath: folder,
                    recursive: false,
                };
            });
            const plugin = new FileSearchPlugin(options, testIconSet, emptyBlackList);
            const actual = plugin.getAllItems();

            const actualFiles = actual.filter((a) => {
                return a.icon === testIconSet.fileIcon;
            });

            const actualFolders = actual.filter((a) => {
                return a.icon === testIconSet.folderIcon;
            });

            expect(actualFiles.length).toBe(testFiles.length * parentFolders.length);
            expect(actualFolders.length).toBe(subFolders.length * parentFolders.length);
        });

        it("should return an empty array if no folders are specified", (): void => {
            const plugin = new FileSearchPlugin([], testIconSet, emptyBlackList);
            const acutal = plugin.getAllItems();

            expect(acutal.length).toBe(0);
        });
    });

    describe("getIndexLength", (): void => {
        it("should return the number of files", (): void => {
            const recursive = false;
            const options = parentFolders.map((folder: string): FileSearchOption => {
                return {
                    folderPath: folder,
                    recursive,
                };
            });

            const plugin = new FileSearchPlugin(options, testIconSet, emptyBlackList);

            const actual = plugin.getIndexLength();
            expect(actual).toBe(parentFolders.length * testFiles.length + parentFolders.length * subFolders.length);
        });
    });
});
