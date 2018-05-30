import { FileSearchPlugin } from "../../../ts/search-plugins/file-search-plugin";
import { mkdirSync, writeFileSync, unlinkSync, rmdirSync } from "fs";
import { join } from "path";
import { Injector } from "../../../ts/injector";
import { platform } from "os";

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

    describe("getAllItems", (): void => {
        beforeEach((): void => {
            for (const parentFolder of parentFolders) {
                mkdirSync(parentFolder);

                for (const subFolder of subFolders) {
                    mkdirSync(join(parentFolder, subFolder));
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
                    rmdirSync(join(parentFolder, subFolder));
                }

                rmdirSync(parentFolder);
            }
        });

        it("should return more than zero search result items", (): void => {
            const plugin = new FileSearchPlugin(parentFolders);
            const actual = plugin.getAllItems();
            const actualLength = actual.length;
            const expectedLength = (testFiles.length  + subFolders.length) * parentFolders.length;

            expect(actualLength).toBe(expectedLength);
        });

        it("all returned items should have name, execution argument and tags set", (): void => {
            const plugin = new FileSearchPlugin(parentFolders);
            const actual = plugin.getAllItems();

            for (const item of actual) {
                expect(item.name.length).toBeGreaterThan(0);
                expect(item.executionArgument.length).toBeGreaterThan(0);
                expect(item.tags).not.toBeUndefined();
                expect(item.tags.length).toBe(0);
            }
        });

        it("should set the right icon", (): void => {
            const iconManager = Injector.getIconManager(platform());
            const plugin = new FileSearchPlugin(parentFolders);
            const actual = plugin.getAllItems();

            const actualFiles = actual.filter((a) => {
                return a.icon === iconManager.getFileIcon();
            });

            const actualFolders = actual.filter((a) => {
                return a.icon === iconManager.getFolderIcon();
            });

            expect(actualFiles.length).toBe(testFiles.length * parentFolders.length);
            expect(actualFolders.length).toBe(subFolders.length * parentFolders.length);
        });

        it("should return an empty array if no folders are specified", (): void => {
            const plugin = new FileSearchPlugin([]);
            const acutal = plugin.getAllItems();

            expect(acutal.length).toBe(0);
        });
    });
});
