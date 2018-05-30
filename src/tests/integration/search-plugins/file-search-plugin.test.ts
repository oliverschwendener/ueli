import { FileSearchPlugin } from "../../../ts/search-plugins/file-search-plugin";
import { mkdirSync, writeFileSync, unlinkSync, rmdirSync } from "fs";
import { join } from "path";

describe(FileSearchPlugin.name, (): void => {
    const testFolders = [
        join(__dirname, "test-folder-1"),
        join(__dirname, "test-folder-2"),
    ];

    const testFiles = [
        "test-file-1",
        "test-file-2",
    ];

    describe("getAllItems", (): void => {
        beforeEach((): void => {
            for (const testFolder of testFolders) {
                mkdirSync(testFolder);
                for (const testFile of testFiles) {
                    const filePath = join(testFolder, testFile);
                    writeFileSync(filePath, "", "utf-8");
                }
            }
        });

        afterEach((): void => {
            for (const testFolder of testFolders) {
                for (const testFile of testFiles) {
                    const filePath = join(testFolder, testFile);
                    unlinkSync(filePath);
                }

                rmdirSync(testFolder);
            }
        });

        it("should return more than zero search result items", (): void => {
            const plugin = new FileSearchPlugin(testFolders);
            const actual = plugin.getAllItems();
            const actualLength = actual.length;
            const expectedLength = testFiles.length * testFolders.length;

            expect(actualLength).toBe(expectedLength);
        });

        it("all returned items should have name, execution argument and tags set", (): void => {
            const plugin = new FileSearchPlugin(testFolders);
            const actual = plugin.getAllItems();

            for (const item of actual) {
                expect(item.name.length).toBeGreaterThan(0);
                expect(item.executionArgument.length).toBeGreaterThan(0);
                expect(item.tags).not.toBeUndefined();
                expect(item.tags.length).toBe(0);
            }
        });
    });
});
