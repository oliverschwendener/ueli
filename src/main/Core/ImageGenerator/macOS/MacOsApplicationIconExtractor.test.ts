import type { CommandlineUtility } from "@Core/CommandlineUtility";
import type { FileSystemUtility } from "@Core/FileSystemUtility";
import { join } from "path";
import { describe, expect, it, vi } from "vitest";
import type { CacheFileNameGenerator } from "../CacheFileNameGenerator";
import { MacOsApplicationIconExtractor } from "./MacOsApplicationIconExtractor";

describe(MacOsApplicationIconExtractor, () => {
    describe("matchesFilePath", () => {
        const extractor = new MacOsApplicationIconExtractor(
            <FileSystemUtility>{},
            <CommandlineUtility>{},
            <CacheFileNameGenerator>{},
            "",
        );

        it("should return true for .app file paths", () =>
            expect(extractor.matchesFilePath(join("path", "to", "file.app"))).toBe(true));

        it("should return false for non-.app file paths", () =>
            expect(extractor.matchesFilePath(join("path", "to", "file.txt"))).toBe(false));
    });

    describe("extractFileIcon", () => {
        it("should generate a new icon if it's not cached on the file system", async () => {
            const pathExistsMock = vi.fn().mockResolvedValue(false);
            const generateCacheFileNameMock = vi.fn().mockReturnValue("cache-file-name");
            const executeCommandMock = vi.fn().mockResolvedValue("output");

            const extractor = new MacOsApplicationIconExtractor(
                <FileSystemUtility>{ pathExists: (filePath) => pathExistsMock(filePath) },
                <CommandlineUtility>{ executeCommand: (command) => executeCommandMock(command) },
                <CacheFileNameGenerator>{ generateCacheFileName: (filePath) => generateCacheFileNameMock(filePath) },
                "cache",
            );

            const appFilePath = join("path", "to", "file.app");
            const cachedFilePath = join("cache", "cache-file-name.png");

            const actual = await extractor.extractFileIcon(appFilePath);

            expect(actual).toEqual({ url: `file://${cachedFilePath}` });
            expect(pathExistsMock).toHaveBeenCalledWith(cachedFilePath);

            expect(executeCommandMock).toHaveBeenCalledWith(
                `defaults read "${join(appFilePath, "Contents", "Info.plist")}" CFBundleIconFile`,
            );

            expect(executeCommandMock).toHaveBeenCalledWith(
                `sips -s format png "${join(appFilePath, "Contents", "Resources", "output.icns")}" -o "${cachedFilePath}"`,
            );

            expect(generateCacheFileNameMock).toHaveBeenCalledWith(appFilePath);
        });

        it("should use the cached icon if it already exists", async () => {
            const pathExistsMock = vi.fn().mockResolvedValue(true);
            const generateCacheFileNameMock = vi.fn().mockReturnValue("cache-file-name");

            const extractor = new MacOsApplicationIconExtractor(
                <FileSystemUtility>{ pathExists: (filePath) => pathExistsMock(filePath) },
                <CommandlineUtility>{},
                <CacheFileNameGenerator>{ generateCacheFileName: (filePath) => generateCacheFileNameMock(filePath) },
                "cache",
            );

            const appFilePath = join("path", "to", "file.app");
            const cachedFilePath = join("cache", "cache-file-name.png");
            const actual = await extractor.extractFileIcon(appFilePath);

            expect(actual).toEqual({ url: `file://${cachedFilePath}` });
            expect(pathExistsMock).toHaveBeenCalledWith(cachedFilePath);
            expect(generateCacheFileNameMock).toHaveBeenCalledWith(appFilePath);
        });
    });

    describe("extractFileIcons", () => {
        it("should extract multiple icons", async () => {
            const pathExistsMock = vi.fn().mockResolvedValue(true);

            const generateCacheFileNameMock = vi.fn().mockImplementation((filePath: string) => {
                const map: Record<string, string> = {
                    "file1.app": "cache-file-name-1",
                    "file2.app": "cache-file-name-2",
                    "file3.app": "cache-file-name-3",
                };

                return map[filePath];
            });

            const extractor = new MacOsApplicationIconExtractor(
                <FileSystemUtility>{ pathExists: (filePath) => pathExistsMock(filePath) },
                <CommandlineUtility>{},
                <CacheFileNameGenerator>{ generateCacheFileName: (filePath) => generateCacheFileNameMock(filePath) },
                "cache",
            );

            expect(await extractor.extractFileIcons(["file1.app", "file2.app", "file3.app"])).toEqual({
                "file1.app": { url: `file://${join("cache", "cache-file-name-1.png")}` },
                "file2.app": { url: `file://${join("cache", "cache-file-name-2.png")}` },
                "file3.app": { url: `file://${join("cache", "cache-file-name-3.png")}` },
            });

            expect(pathExistsMock).toHaveBeenCalledWith(join("cache", "cache-file-name-1.png"));
            expect(pathExistsMock).toHaveBeenCalledWith(join("cache", "cache-file-name-2.png"));
            expect(pathExistsMock).toHaveBeenCalledWith(join("cache", "cache-file-name-3.png"));

            expect(generateCacheFileNameMock).toHaveBeenCalledWith("file1.app");
            expect(generateCacheFileNameMock).toHaveBeenCalledWith("file2.app");
            expect(generateCacheFileNameMock).toHaveBeenCalledWith("file3.app");
        });
    });
});
