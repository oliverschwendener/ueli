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

function createFile(filePath: string, data: string): void {
    fs.writeFileSync(filePath, data);
}

function deleteFile(filePath: string): void {
    fs.unlinkSync(filePath);
}

describe(FileHelpers.name, (): void => {
    describe(FileHelpers.getFilesFromFolder.name, (): void => {
        const testFolder = testFolderPaths[0];
        const hiddenFilePath = path.join(testFolder, ".hidden-file-name");

        createTestFolders([testFolder]);
        createFile(hiddenFilePath, "some-text");

        it("should return only visible files", (): void => {
            const actual = FileHelpers.getFilesFromFolder(testFolder);
            expect(actual.length).toBe(testFiles.length);
        });

        afterAll((): void => {
            deleteFile(hiddenFilePath);
            deleteTestFolders([testFolder]);
        });
    });

    describe(FileHelpers.getFilesFromFolderRecursively.name, (): void => {
        const testFolder = testFolderPaths[0];
        const hiddenFilePath = path.join(testFolder, ".hidden-file-name");

        beforeAll((): void => {
            createTestFolders([testFolder]);
            createFile(hiddenFilePath, "some-data");
        });

        it("should return only visible files", (): void => {
            const actual = FileHelpers.getFilesFromFolderRecursively(testFolder);
            expect(actual.length).toBeGreaterThan(0);
        });

        afterAll((): void => {
            deleteFile(hiddenFilePath);
            deleteTestFolders([testFolder]);
        });
    });

    describe(FileHelpers.getFilesFromFoldersRecursively.name, (): void => {
        const testFolders = testFolderPaths;

        beforeAll((): void => {
            createTestFolders(testFolders);
        });

        it("should return some files", (): void => {
            const actual = FileHelpers.getFilesFromFoldersRecursively(testFolders);
            expect(actual.length).toBeGreaterThan(0);
        });

        it("should return an empty list when folder does not exist", (): void => {
            const testFolder = path.join(os.homedir(), "hopefully-this-folder-does-not-exist");

            const actual = FileHelpers.getFilesFromFoldersRecursively([testFolder]);

            expect(actual.length).toBe(0);
        });

        afterAll((): void => {
            deleteTestFolders(testFolders);
        });
    });
});
