import * as path from "path";
import * as os from "os";
import * as fs from "fs";
import { expect } from "chai";
import { FileHelpers } from "./../../src/ts/helpers/file-helpers";

const testFolderPaths = [
    path.join(os.homedir(), "test-folder"),
    path.join(os.homedir(), "test-folder-2")
];

const testFiles = [
    "test-file",
    "test-file-2",
    "test-file-3"
];

function createTestFolders(folderPaths: string[]): void {
    for (let folderPath of folderPaths) {
        fs.mkdirSync(folderPath);

        for (let file of testFiles) {
            fs.writeFileSync(path.join(folderPath, file), "This is a test file", 'utf-8');
        }
    }
}

function deleteTestFolders(folderPaths: string[]): void {
    for (let folderPath of folderPaths) {
        for (let file of testFiles) {
            fs.unlinkSync(path.join(folderPath, file));
        }

        fs.rmdirSync(folderPath);
    }
}

describe("File Helpers", (): void => {
    describe("getFilesFromFolderRecursively", (): void => {
        it("should return some files", (): void => {
            let testFolder = testFolderPaths[0];
            createTestFolders([testFolder]);

            let actual = FileHelpers.getFilesFromFolderRecursively(testFolder);

            expect(actual.length).to.be.greaterThan(0);

            deleteTestFolders([testFolder])
        });
    });

    describe("getFilesFromFoldersRecursivley", (): void => {
        it("should return some files", (): void => {
            let testFolders = testFolderPaths;
            createTestFolders(testFolders);

            let actual = FileHelpers.getFilesFromFoldersRecursively(testFolders);

            expect(actual.length).to.be.greaterThan(0);

            deleteTestFolders(testFolders);
        });
    });
});