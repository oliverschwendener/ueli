import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { FileSystemUtility } from "@Core/FileSystemUtility";
import type { App } from "electron";
import { describe, expect, it, vi } from "vitest";
import { MacOsFolderIconExtractor } from "./MacOsFolderIconExtractor";

describe(MacOsFolderIconExtractor, () => {
    describe(MacOsFolderIconExtractor.prototype.matchesFilePath, () => {
        const testMatchesFilePath = ({
            expected,
            candidate,
            expectIsDirectoryCheck,
            isDirectory,
            homePath,
        }: {
            expected: boolean;
            candidate: string;
            expectIsDirectoryCheck: boolean;
            isDirectory: boolean;
            homePath?: string;
        }) => {
            const isDirectoryMock = vi.fn().mockReturnValue(isDirectory);
            const getPathMock = vi.fn().mockReturnValue(homePath ?? "/home");

            const extractor = new MacOsFolderIconExtractor(
                <AssetPathResolver>{},
                <FileSystemUtility>{ isDirectory: (p) => isDirectoryMock(p) },
                <App>{ getPath: (n) => getPathMock(n) },
            );

            expect(extractor.matchesFilePath(candidate)).toBe(expected);
            expect(getPathMock).toHaveBeenCalledWith("home");

            if (expectIsDirectoryCheck) {
                expect(isDirectoryMock).toHaveBeenCalledOnce();
            }
        };

        it("should return true when given path is a directory and does not end with .app", () =>
            testMatchesFilePath({
                expected: true,
                candidate: "/some-folder-path",
                expectIsDirectoryCheck: true,
                isDirectory: true,
            }));

        it("should return false when given path is a directory but ends with .app", () =>
            testMatchesFilePath({
                expected: false,
                candidate: "/some-folder-path.app",
                expectIsDirectoryCheck: true,
                isDirectory: true,
            }));

        it("should return true for the home folder path", () =>
            testMatchesFilePath({
                expected: true,
                candidate: "/home",
                homePath: "/home",
                expectIsDirectoryCheck: false,
                isDirectory: false, // This will be ignored
            }));

        it("should return true for the home Applications folder path", () =>
            testMatchesFilePath({
                expected: true,
                candidate: "/home/Applications",
                homePath: "/home",
                expectIsDirectoryCheck: false,
                isDirectory: false, // This will be ignored
            }));

        it("should return true for the Desktop folder path", () =>
            testMatchesFilePath({
                expected: true,
                candidate: "/home/Desktop",
                homePath: "/home",
                expectIsDirectoryCheck: false,
                isDirectory: false, // This will be ignored
            }));

        it("should return true for the Documents folder path", () =>
            testMatchesFilePath({
                expected: true,
                candidate: "/home/Documents",
                homePath: "/home",
                expectIsDirectoryCheck: false,
                isDirectory: false, // This will be ignored
            }));

        it("should return true for the Downloads folder path", () =>
            testMatchesFilePath({
                expected: true,
                candidate: "/home/Downloads",
                homePath: "/home",
                expectIsDirectoryCheck: false,
                isDirectory: false, // This will be ignored
            }));

        it("should return true for the Library folder path", () =>
            testMatchesFilePath({
                expected: true,
                candidate: "/home/Library",
                homePath: "/home",
                expectIsDirectoryCheck: false,
                isDirectory: false, // This will be ignored
            }));

        it("should return true for the Movies folder path", () =>
            testMatchesFilePath({
                expected: true,
                candidate: "/home/Movies",
                homePath: "/home",
                expectIsDirectoryCheck: false,
                isDirectory: false, // This will be ignored
            }));

        it("should return true for the Music folder path", () =>
            testMatchesFilePath({
                expected: true,
                candidate: "/home/Music",
                homePath: "/home",
                expectIsDirectoryCheck: false,
                isDirectory: false, // This will be ignored
            }));

        it("should return true for the Pictures folder path", () =>
            testMatchesFilePath({
                expected: true,
                candidate: "/home/Pictures",
                homePath: "/home",
                expectIsDirectoryCheck: false,
                isDirectory: false, // This will be ignored
            }));

        it("should return true for the Public folder path", () =>
            testMatchesFilePath({
                expected: true,
                candidate: "/home/Public",
                homePath: "/home",
                expectIsDirectoryCheck: false,
                isDirectory: false, // This will be ignored
            }));

        it("should return true for the root Applications folder path", () =>
            testMatchesFilePath({
                expected: true,
                candidate: "/Applications",
                homePath: "/home",
                expectIsDirectoryCheck: false,
                isDirectory: false, // This will be ignored
            }));

        it("should return true for the root Library folder path", () =>
            testMatchesFilePath({
                expected: true,
                candidate: "/Library",
                homePath: "/home",
                expectIsDirectoryCheck: false,
                isDirectory: false, // This will be ignored
            }));

        it("should return true for the System Applications folder path", () =>
            testMatchesFilePath({
                expected: true,
                candidate: "/System/Applications",
                homePath: "/home",
                expectIsDirectoryCheck: false,
                isDirectory: false, // This will be ignored
            }));

        it("should return true for the Users folder path", () =>
            testMatchesFilePath({
                expected: true,
                candidate: "/Users",
                homePath: "/home",
                expectIsDirectoryCheck: false,
                isDirectory: false, // This will be ignored
            }));

        it("should return true for the System folder path", () =>
            testMatchesFilePath({
                expected: true,
                candidate: "/System",
                homePath: "/home",
                expectIsDirectoryCheck: false,
                isDirectory: false, // This will be ignored
            }));

        it("should return true for the System Library folder path", () =>
            testMatchesFilePath({
                expected: true,
                candidate: "/System/Library",
                homePath: "/home",
                expectIsDirectoryCheck: false,
                isDirectory: false, // This will be ignored
            }));
    });

    describe(MacOsFolderIconExtractor.prototype.extractFileIcons, () => {
        it("should return the correct icons for all provided file paths", async () => {
            const getPathMock = vi.fn().mockReturnValue("/home");
            const getModuleAssetPath = vi.fn().mockImplementation((m, p) => `path/to/${p}`);

            const extractor = new MacOsFolderIconExtractor(
                <AssetPathResolver>{ getModuleAssetPath: (m, p) => getModuleAssetPath(m, p) },
                <FileSystemUtility>{},
                <App>{ getPath: (n) => getPathMock(n) },
            );

            expect(await extractor.extractFileIcons(["/home", "/home/Downloads", "/some/random/folder"])).toEqual({
                "/home": { url: "file://path/to/macOS/HomeFolderIcon.png" },
                "/home/Downloads": { url: "file://path/to/macOS/DownloadsFolderIcon.png" },
                "/some/random/folder": { url: "file://path/to/macOS/GenericFolderIcon.png" },
            });

            expect(getPathMock).toHaveBeenCalledWith("home");
            expect(getModuleAssetPath).toHaveBeenCalledTimes(3);
        });
    });
});
