import * as path from "path";
import * as os from "os";
import { expect } from "chai";
import { FileHelpers } from "./../../src/ts/helpers/file-helpers";

describe("File Helpers", () => {
    describe("getFilesFromFolderRecursively", () => {
        it("should return some files", () => {
            let testFolderPath = path.join(os.homedir(), "Downloads");

            let actual = FileHelpers.getFilesFromFolderRecursively(testFolderPath);

            expect(actual.length).to.be.greaterThan(0);
        });
    });

    describe("getFilesFromFoldersRecursivley", () => {
        it("should return some files", () => {
            let testFolderPaths = [
                path.join(os.homedir(), "Downloads"),
                path.join(os.homedir(), "Desktop")
            ];

            let actual = FileHelpers.getFilesFromFoldersRecursively(testFolderPaths);

            expect(actual.length).to.be.greaterThan(0);
        });
    });
});