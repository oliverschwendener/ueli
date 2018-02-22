import { expect } from "chai";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { FileHelpers } from "../../../ts/helpers/file-helpers";

const testFolderPaths = [
    path.join(os.homedir(), "test-folder"),
    path.join(os.homedir(), "test-folder-2"),
];

const testFiles = [
    "test-file",
    "test-file-2",
    "test-file-3",
];

function createTestFolders(folderPaths: string[]): void {
    for (const folderPath of folderPaths) {
        fs.mkdirSync(folderPath);

        for (const file of testFiles) {
            fs.writeFileSync(path.join(folderPath, file), "This is a test file", "utf-8");
        }
    }
}

function deleteTestFolders(folderPaths: string[]): void {
    for (const folderPath of folderPaths) {
        for (const file of testFiles) {
            fs.unlinkSync(path.join(folderPath, file));
        }

        fs.rmdirSync(folderPath);
    }
}

describe(FileHelpers.name, (): void => {
    describe(FileHelpers.getFilesFromFolder.name, (): void => {
        it("should return some files", (): void => {
            const testFolder = testFolderPaths[0];
            createTestFolders([testFolder]);

            const actual = FileHelpers.getFilesFromFolder(testFolder);

            expect(actual.length).to.be.greaterThan(0);

            deleteTestFolders([testFolder]);
        });
    });

    describe(FileHelpers.getFilesFromFolderRecursively.name, (): void => {
        it("should return some files", (): void => {
            const testFolder = testFolderPaths[0];
            createTestFolders([testFolder]);

            const actual = FileHelpers.getFilesFromFolderRecursively(testFolder);

            expect(actual.length).to.be.greaterThan(0);

            deleteTestFolders([testFolder]);
        });
    });

    describe(FileHelpers.getFilesFromFoldersRecursively.name, (): void => {
        it("should return some files", (): void => {
            const testFolders = testFolderPaths;
            createTestFolders(testFolders);

            const actual = FileHelpers.getFilesFromFoldersRecursively(testFolders);

            expect(actual.length).to.be.greaterThan(0);

            deleteTestFolders(testFolders);
        });
    });
});
