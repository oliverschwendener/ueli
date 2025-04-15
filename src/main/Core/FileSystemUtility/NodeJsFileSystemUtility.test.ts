import { mkdir, rm, writeFile } from "fs/promises";
import { join } from "path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { NodeJsFileSystemUtility } from "./NodeJsFileSystemUtility";

describe(NodeJsFileSystemUtility, () => {
    const tempFolderPath = join(__dirname, "NodeJsFileSystemUtilityTest");

    beforeEach(() => mkdir(tempFolderPath));
    afterEach(() => rm(tempFolderPath, { recursive: true }));

    describe(NodeJsFileSystemUtility.prototype.pathExists, () => {
        it("should return true when passing in a folder path that exists", async () => {
            const tempFolderExists = await new NodeJsFileSystemUtility().pathExists(tempFolderPath);
            expect(tempFolderExists).toBe(true);
        });

        it("should return false when passing in a folder path that does not exists", async () => {
            const tempFolderExists = await new NodeJsFileSystemUtility().pathExists(join(tempFolderPath, "n"));
            expect(tempFolderExists).toBe(false);
        });
    });

    describe(NodeJsFileSystemUtility.prototype.clearFolder, () => {
        it("should remove all files and folders within a given folder path", async () => {
            const fileSystemUtility = new NodeJsFileSystemUtility();

            await fileSystemUtility.createFolder(join(tempFolderPath, "folder1"));
            await fileSystemUtility.createFolder(join(tempFolderPath, "folder2"));
            await fileSystemUtility.writeTextFile("test", join(tempFolderPath, "file1.txt"));
            await fileSystemUtility.writeTextFile("test 2", join(tempFolderPath, "file2.txt"));

            await fileSystemUtility.clearFolder(tempFolderPath);

            const actual = await fileSystemUtility.readDirectory(tempFolderPath);

            expect(actual).toEqual([]);
        });
    });

    describe(NodeJsFileSystemUtility.prototype.copyFile, () => {
        it("should copy a file from one location to another", async () => {
            const fileSystemUtility = new NodeJsFileSystemUtility();
            const sourceFilePath = join(tempFolderPath, "source.txt");
            const destinationFilePath = join(tempFolderPath, "destination.txt");

            await fileSystemUtility.writeTextFile("test", sourceFilePath);
            await fileSystemUtility.copyFile(sourceFilePath, destinationFilePath);

            const sourceFileExists = await fileSystemUtility.pathExists(sourceFilePath);
            const destinationFileExists = await fileSystemUtility.pathExists(destinationFilePath);

            expect(sourceFileExists).toBe(true);
            expect(destinationFileExists).toBe(true);
        });
    });

    describe(NodeJsFileSystemUtility.prototype.createFolder, () => {
        it("should create a folder at a given path", async () => {
            const fileSystemUtility = new NodeJsFileSystemUtility();
            const folderPath = join(tempFolderPath, "folder");

            await fileSystemUtility.createFolder(folderPath);

            const folderExists = await fileSystemUtility.pathExists(folderPath);
            expect(folderExists).toBe(true);
        });
    });

    describe(NodeJsFileSystemUtility.prototype.createFolderIfDoesntExist, () => {
        it("should create a folder at a given path if it doesn't exist", async () => {
            const fileSystemUtility = new NodeJsFileSystemUtility();
            const folderPath = join(tempFolderPath, "folder");

            await fileSystemUtility.createFolderIfDoesntExist(folderPath);

            const folderExists = await fileSystemUtility.pathExists(folderPath);
            expect(folderExists).toBe(true);
        });

        it("should not create a folder at a given path if it already exists", async () => {
            const fileSystemUtility = new NodeJsFileSystemUtility();
            const folderPath = join(tempFolderPath, "folder");

            await fileSystemUtility.createFolder(folderPath);
            await fileSystemUtility.createFolderIfDoesntExist(folderPath);

            const folderExists = await fileSystemUtility.pathExists(folderPath);
            expect(folderExists).toBe(true);
        });
    });

    describe(NodeJsFileSystemUtility.prototype.existsSync, () => {
        it("should return true when the file at the given path exists", async () => {
            const fileSystemUtility = new NodeJsFileSystemUtility();
            const filePath = join(tempFolderPath, "file.txt");

            await fileSystemUtility.writeTextFile("test", filePath);

            expect(fileSystemUtility.existsSync(filePath)).toBe(true);
        });

        it("should return false when the file at the given path does not exist", async () => {
            const fileSystemUtility = new NodeJsFileSystemUtility();
            const filePath = join(tempFolderPath, "file.txt");

            expect(fileSystemUtility.existsSync(filePath)).toBe(false);
        });
    });

    describe(NodeJsFileSystemUtility.prototype.isDirectory, () => {
        it("should return true when the the given path is a directory", async () => {
            const fileSystemUtility = new NodeJsFileSystemUtility();
            const folderPath = join(tempFolderPath, "folder");

            await fileSystemUtility.createFolder(folderPath);

            expect(fileSystemUtility.isDirectory(folderPath)).toBe(true);
        });

        it("should return false when the given path is not a directory", async () => {
            const fileSystemUtility = new NodeJsFileSystemUtility();
            const filePath = join(tempFolderPath, "file.txt");

            await fileSystemUtility.writeTextFile("test", filePath);

            expect(fileSystemUtility.isDirectory(filePath)).toBe(false);
        });
    });

    describe(NodeJsFileSystemUtility.prototype.readDirectory, () => {
        it("should return a list of absolute folder and file paths when reading a folder", async () => {
            const fileSystemUtility = new NodeJsFileSystemUtility();
            const folderPath = join(tempFolderPath, "folder");
            const filePath1 = join(tempFolderPath, "file1.txt");
            const filePath2 = join(folderPath, "file2.txt");

            await fileSystemUtility.createFolder(folderPath);
            await fileSystemUtility.writeTextFile("test", filePath1);
            await fileSystemUtility.writeTextFile("test 2", filePath2);

            const actual = await fileSystemUtility.readDirectory(tempFolderPath, false);

            expect(actual).toEqual([filePath1, folderPath]);
        });

        it("should return a list of absolute folder and file paths when reading a folder recursively", async () => {
            const fileSystemUtility = new NodeJsFileSystemUtility();
            const folderPath = join(tempFolderPath, "folder");
            const filePath1 = join(tempFolderPath, "file1.txt");
            const filePath2 = join(folderPath, "file2.txt");

            await fileSystemUtility.createFolder(folderPath);
            await fileSystemUtility.writeTextFile("test", filePath1);
            await fileSystemUtility.writeTextFile("test 2", filePath2);

            const actual = await fileSystemUtility.readDirectory(tempFolderPath, true);

            expect(actual).toEqual([filePath1, folderPath, filePath2]);
        });

        it("should return an empty array when the given folder path is empty", async () => {
            const fileSystemUtility = new NodeJsFileSystemUtility();
            const folderPath = join(tempFolderPath, "folder");

            await fileSystemUtility.createFolder(folderPath);

            const actual = await fileSystemUtility.readDirectory(folderPath);

            expect(actual).toEqual([]);
        });
    });

    describe(NodeJsFileSystemUtility.prototype.readDirectorySync, () => {
        it("should return a list of absolute folder and file paths when reading a folder", async () => {
            const fileSystemUtility = new NodeJsFileSystemUtility();
            const folderPath = join(tempFolderPath, "folder");
            const filePath1 = join(tempFolderPath, "file1.txt");
            const filePath2 = join(folderPath, "file2.txt");

            await fileSystemUtility.createFolder(folderPath);
            await fileSystemUtility.writeTextFile("test", filePath1);
            await fileSystemUtility.writeTextFile("test 2", filePath2);

            const actual = fileSystemUtility.readDirectorySync(tempFolderPath, false);

            expect(actual).toEqual([filePath1, folderPath]);
        });

        it("should return a list of absolute folder and file paths when reading a folder recursively", async () => {
            const fileSystemUtility = new NodeJsFileSystemUtility();
            const folderPath = join(tempFolderPath, "folder");
            const filePath1 = join(tempFolderPath, "file1.txt");
            const filePath2 = join(folderPath, "file2.txt");

            await fileSystemUtility.createFolder(folderPath);
            await fileSystemUtility.writeTextFile("test", filePath1);
            await fileSystemUtility.writeTextFile("test 2", filePath2);

            const actual = fileSystemUtility.readDirectorySync(tempFolderPath, true);

            expect(actual).toEqual([filePath1, folderPath, filePath2]);
        });

        it("should return an empty array when the given folder path is empty", async () => {
            const fileSystemUtility = new NodeJsFileSystemUtility();
            const folderPath = join(tempFolderPath, "folder");

            await fileSystemUtility.createFolder(folderPath);

            const actual = fileSystemUtility.readDirectorySync(folderPath);

            expect(actual).toEqual([]);
        });
    });

    describe(NodeJsFileSystemUtility.prototype.readFile, () => {
        it("should read the contents of a file as a buffer", async () => {
            const fileSystemUtility = new NodeJsFileSystemUtility();
            const filePath = join(tempFolderPath, "file.txt");

            await fileSystemUtility.writeTextFile("test", filePath);

            const actual = await fileSystemUtility.readFile(filePath);

            expect(actual).toEqual(Buffer.from("test", "utf-8"));
        });
    });

    describe(NodeJsFileSystemUtility.prototype.readFileSync, () => {
        it("should read the contents of a file as a buffer", async () => {
            const fileSystemUtility = new NodeJsFileSystemUtility();
            const filePath = join(tempFolderPath, "file.txt");

            await fileSystemUtility.writeTextFile("test", filePath);

            expect(fileSystemUtility.readFileSync(filePath)).toEqual(Buffer.from("test", "utf-8"));
        });
    });

    describe(NodeJsFileSystemUtility.prototype.readJsonFile, () => {
        it("should read the contents of a file and parse it to an object", async () => {
            const fileSystemUtility = new NodeJsFileSystemUtility();
            const filePath = join(tempFolderPath, "file.json");
            const content = { test: "test" };

            await fileSystemUtility.writeJsonFile(content, filePath);

            const actual = await fileSystemUtility.readJsonFile(filePath);

            expect(actual).toEqual(content);
        });
    });

    describe(NodeJsFileSystemUtility.prototype.readJsonFileSync, () => {
        it("should read the contents of a file synchronously and parse it to an object", async () => {
            const fileSystemUtility = new NodeJsFileSystemUtility();
            const filePath = join(tempFolderPath, "file.json");
            const content = { test: "test" };

            await fileSystemUtility.writeJsonFile(content, filePath);

            expect(fileSystemUtility.readJsonFileSync(filePath)).toEqual(content);
        });
    });

    describe(NodeJsFileSystemUtility.prototype.readTextFile, () => {
        it("should read the contents of a file as a string", async () => {
            const fileSystemUtility = new NodeJsFileSystemUtility();
            const filePath = join(tempFolderPath, "file.txt");
            const content = "test";

            await fileSystemUtility.writeTextFile(content, filePath);

            const actual = await fileSystemUtility.readTextFile(filePath);

            expect(actual).toBe(content);
        });

        it("should read the contents of a utf-16le encoded file as a string", async () => {
            const fileSystemUtility = new NodeJsFileSystemUtility();
            const filePath = join(tempFolderPath, "file.txt");
            const content = "test";

            await writeFile(filePath, content, { encoding: "utf-16le" });

            const actual = await fileSystemUtility.readTextFile(filePath, "utf-16le");

            expect(actual).toBe(content);
        });
    });

    describe(NodeJsFileSystemUtility.prototype.readTextFileSync, () => {
        it("should read the contents of a file synchronously as a string", async () => {
            const fileSystemUtility = new NodeJsFileSystemUtility();
            const filePath = join(tempFolderPath, "file.txt");
            const content = "test";

            await fileSystemUtility.writeTextFile(content, filePath);

            expect(fileSystemUtility.readTextFileSync(filePath)).toBe(content);
        });

        it("should read the contents of a utf-16le encoded file synchronously as a string", async () => {
            const fileSystemUtility = new NodeJsFileSystemUtility();
            const filePath = join(tempFolderPath, "file.txt");
            const content = "test";

            await writeFile(filePath, content, { encoding: "utf-16le" });

            expect(fileSystemUtility.readTextFileSync(filePath, "utf-16le")).toBe(content);
        });
    });

    describe(NodeJsFileSystemUtility.prototype.removeFile, () => {
        it("should remove a file at the given path", async () => {
            const fileSystemUtility = new NodeJsFileSystemUtility();
            const filePath = join(tempFolderPath, "file.txt");

            await fileSystemUtility.writeTextFile("test", filePath);
            await fileSystemUtility.removeFile(filePath);

            const fileExists = await fileSystemUtility.pathExists(filePath);

            expect(fileExists).toBe(false);
        });
    });

    describe(NodeJsFileSystemUtility.prototype.writeJsonFile, () => {
        it("should write an object to a file as a JSON string", async () => {
            const fileSystemUtility = new NodeJsFileSystemUtility();
            const filePath = join(tempFolderPath, "file.json");
            const content = { test: "test" };

            await fileSystemUtility.writeJsonFile(content, filePath);

            const actual = await fileSystemUtility.readJsonFile(filePath);

            expect(actual).toEqual(content);
        });
    });

    describe(NodeJsFileSystemUtility.prototype.writeJsonFileSync, () => {
        it("should write an object to a file synchronously as a JSON string", async () => {
            const fileSystemUtility = new NodeJsFileSystemUtility();
            const filePath = join(tempFolderPath, "file.json");
            const content = { test: "test" };

            fileSystemUtility.writeJsonFileSync(content, filePath);

            expect(fileSystemUtility.readJsonFileSync(filePath)).toEqual(content);
        });
    });

    describe(NodeJsFileSystemUtility.prototype.writeTextFile, () => {
        it("should write a string to a file", async () => {
            const fileSystemUtility = new NodeJsFileSystemUtility();
            const filePath = join(tempFolderPath, "file.txt");
            const content = "test";

            await fileSystemUtility.writeTextFile(content, filePath);

            const actual = await fileSystemUtility.readTextFile(filePath);

            expect(actual).toBe(content);
        });
    });

    describe(NodeJsFileSystemUtility.prototype.writeFile, () => {
        it("should write a buffer to a file", async () => {
            const fileSystemUtility = new NodeJsFileSystemUtility();
            const filePath = join(tempFolderPath, "file.txt");
            const buffer = Buffer.from("test", "utf-8");

            await fileSystemUtility.writeFile(buffer, filePath);

            expect(await fileSystemUtility.readFile(filePath)).toEqual(buffer);
        });
    });
});
