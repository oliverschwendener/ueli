import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { FileHelpers } from "../../../ts/helpers/file-helpers";
import { join } from "path";
import { mkdirSync, writeFileSync, unlinkSync, rmdirSync, chmodSync } from "fs";

describe(FileHelpers.name, (): void => {
    describe(FileHelpers.getFilesFromFolder.name, (): void => {
        const testFolder = "test-folder";
        const testFiles = [
            join(testFolder, "test-file-1"),
            join(testFolder, "test-file-2"),
            join(testFolder, "test-file-3"),
        ];

        beforeEach((): void => {
            mkdirSync(testFolder);

            for (const testFile of testFiles) {
                writeFileSync(testFile, "", "utf-8");
            }
        });

        afterEach((): void => {
            for (const testFile of testFiles) {
                unlinkSync(testFile);
            }

            rmdirSync(testFolder);
        });

        it("should return all files from a folder", (): void => {
            const files = FileHelpers.getFilesFromFolder(testFolder);
            const acutalLength = files.length;
            const expectedLength = testFiles.length;

            expect(acutalLength).toBe(expectedLength);
        });

        it("should return an empty array if the folder does not exist", (): void => {
            const files = FileHelpers.getFilesFromFolder("this-folder-does-not-exist");
            expect(files.length).toBe(0);
        });
    });

    describe(FileHelpers.getFilesFromFolderRecursively.name, (): void => {
        const parentFolder = "parent-folder";
        const subFolder = join(parentFolder, "sub-folder");
        const subFolderFiles = [
            join(subFolder, "sub-folder-file-1"),
            join(subFolder, "sub-folder-file-2"),
            join(subFolder, "sub-folder-file-3"),
        ];

        beforeEach((): void => {
            mkdirSync(parentFolder);
            mkdirSync(subFolder);

            for (const testFile of subFolderFiles) {
                writeFileSync(testFile, "", "utf-8");
            }
        });

        afterEach((): void => {
            for (const testFile of subFolderFiles) {
                unlinkSync(testFile);
            }

            rmdirSync(subFolder);
            rmdirSync(parentFolder);
        });

        it("should get all files recursively", (): void => {
            const files = FileHelpers.getFilesFromFolderRecursively(parentFolder);
            const actualLength = files.length;
            const expectedLength = subFolderFiles.length;

            expect(actualLength).toBe(expectedLength);
        });

        it("should return an empty array if folder does not exist", (): void => {
            const files = FileHelpers.getFilesFromFolderRecursively("this-folder-does-not-exist");
            const actualLength = files.length;
            const expectedLength = 0;

            expect(actualLength).toBe(expectedLength);
        });
    });

    describe(FileHelpers.getFilesFromFolderRecursively.name, (): void => {
        const parentFolder = "parent-folder";
        const subFolders = [
            join(parentFolder, "sub-folder-1"),
            join(parentFolder, "sub-folder-2.app"),
        ];
        const subFolderFiles = [
            "file-1",
            "file-2",
            "file-3",
        ];

        beforeEach((): void => {
            mkdirSync(parentFolder);

            for (const subfolder of subFolders) {
                mkdirSync(subfolder);

                for (const subFolderFile of subFolderFiles) {
                    writeFileSync(join(subfolder, subFolderFile), "", "utf-8");
                }
            }
        });

        afterEach((): void => {
            for (const subFolder of subFolders) {
                for (const subFolderFile of subFolderFiles) {
                    unlinkSync(join(subFolder, subFolderFile));
                }

                rmdirSync(subFolder);
            }

            rmdirSync(parentFolder);
        });

        it("should treat folders that end with '.app' like files", (): void => {
            const files = FileHelpers.getFilesFromFolderRecursively(parentFolder);
            const actualLength = files.length;
            const expectedLength = subFolderFiles.length + 1;

            expect(actualLength).toBe(actualLength);
        });
    });

    describe(FileHelpers.getFilesFromFoldersRecursively, (): void => {
        const testFolders = [
            "test-folder-1",
            "test-folder-2",
        ];

        const testFiles = [
            "test-file-1",
            "test-file-2",
            "test-file-3",
        ];

        beforeEach((): void => {
            for (const testFolder of testFolders) {
                mkdirSync(testFolder);

                for (const testFile of testFiles) {
                    writeFileSync(join(testFolder, testFile), "", "utf-8");
                }
            }
        });

        afterEach((): void => {
            for (const testFolder of testFolders) {
                for (const testFile of testFiles) {
                    unlinkSync(join(testFolder, testFile));
                }

                rmdirSync(testFolder);
            }
        });

        it("should return all files from all folders recursively", (): void => {
            const files = FileHelpers.getFilesFromFoldersRecursively(testFolders);
            const actualLength = files.length;
            const expectedLength = testFiles.length * testFolders.length;

            expect(actualLength).toBe(expectedLength);
        });
    });
});
