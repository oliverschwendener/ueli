import * as path from "path";
import { expect } from "chai";
import { FileHelpers } from "./../../src/ts/helpers/file-helpers";

describe("File Helpers", () => {
    describe("getFilesFromFolderRecursively", () => {
        it("should return some files", () => {
            let testFolderPath = path.join(process.env.USERPROFILE, "Downloads");

            let actual = FileHelpers.getFilesFromFolderRecursively(testFolderPath);

            expect(actual.length).to.be.greaterThan(0);
        });
    });

    describe("getFilesFromFoldersRecursivley", () => {
        it("should return some files", () => {
            let testFolderPaths = [
                path.join(process.env.USERPROFILE, "Downloads"),
                path.join(process.env.USERPROFILE, "Desktop")
            ];

            let actual = FileHelpers.getFilesFromFoldersRecursively(testFolderPaths);

            expect(actual.length).to.be.greaterThan(0);
        });
    });
});