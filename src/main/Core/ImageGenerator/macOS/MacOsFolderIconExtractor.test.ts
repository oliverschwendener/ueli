import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { FileSystemUtility } from "@Core/FileSystemUtility";
import type { App } from "electron";
import { join } from "path";
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
            const getPathMock = vi.fn().mockReturnValue(homePath ?? "homeFolderPath");

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
                candidate: "someFolderPath",
                expectIsDirectoryCheck: true,
                isDirectory: true,
            }));

        it("should return false when given path is a directory but ends with .app", () =>
            testMatchesFilePath({
                expected: false,
                candidate: "someFolderPath.app",
                expectIsDirectoryCheck: true,
                isDirectory: true,
            }));

        it("should return true for the home folder path", () =>
            testMatchesFilePath({
                expected: true,
                candidate: "homeFolderPath",
                homePath: "homeFolderPath",
                expectIsDirectoryCheck: false,
                isDirectory: false, // This will be ignored
            }));

        it("should return true for the home Applications folder path", () =>
            testMatchesFilePath({
                expected: true,
                candidate: join("home", "Applications"),
                homePath: "home",
                expectIsDirectoryCheck: false,
                isDirectory: false, // This will be ignored
            }));

        it("should return true for the Desktop folder path", () =>
            testMatchesFilePath({
                expected: true,
                candidate: join("home", "Desktop"),
                homePath: "home",
                expectIsDirectoryCheck: false,
                isDirectory: false, // This will be ignored
            }));

        it("should return true for the Documents folder path", () =>
            testMatchesFilePath({
                expected: true,
                candidate: join("home", "Documents"),
                homePath: "home",
                expectIsDirectoryCheck: false,
                isDirectory: false, // This will be ignored
            }));

        it("should return true for the Downloads folder path", () =>
            testMatchesFilePath({
                expected: true,
                candidate: join("home", "Downloads"),
                homePath: "home",
                expectIsDirectoryCheck: false,
                isDirectory: false, // This will be ignored
            }));

        it("should return true for the Library folder path", () =>
            testMatchesFilePath({
                expected: true,
                candidate: join("home", "Library"),
                homePath: "home",
                expectIsDirectoryCheck: false,
                isDirectory: false, // This will be ignored
            }));

        it("should return true for the Movies folder path", () =>
            testMatchesFilePath({
                expected: true,
                candidate: join("home", "Movies"),
                homePath: "home",
                expectIsDirectoryCheck: false,
                isDirectory: false, // This will be ignored
            }));

        it("should return true for the Music folder path", () =>
            testMatchesFilePath({
                expected: true,
                candidate: join("home", "Music"),
                homePath: "home",
                expectIsDirectoryCheck: false,
                isDirectory: false, // This will be ignored
            }));

        it("should return true for the Pictures folder path", () =>
            testMatchesFilePath({
                expected: true,
                candidate: join("home", "Pictures"),
                homePath: "home",
                expectIsDirectoryCheck: false,
                isDirectory: false, // This will be ignored
            }));

        it("should return true for the Public folder path", () =>
            testMatchesFilePath({
                expected: true,
                candidate: join("home", "Public"),
                homePath: "home",
                expectIsDirectoryCheck: false,
                isDirectory: false, // This will be ignored
            }));

        it("should return true for the root Applications folder path", () =>
            testMatchesFilePath({
                expected: true,
                candidate: "/Applications",
                expectIsDirectoryCheck: false,
                isDirectory: false, // This will be ignored
            }));

        it("should return true for the root Library folder path", () =>
            testMatchesFilePath({
                expected: true,
                candidate: "/Library",
                expectIsDirectoryCheck: false,
                isDirectory: false, // This will be ignored
            }));

        it("should return true for the System Applications folder path", () =>
            testMatchesFilePath({
                expected: true,
                candidate: "/System/Applications",
                expectIsDirectoryCheck: false,
                isDirectory: false, // This will be ignored
            }));

        it("should return true for the Users folder path", () =>
            testMatchesFilePath({
                expected: true,
                candidate: "/Users",
                expectIsDirectoryCheck: false,
                isDirectory: false, // This will be ignored
            }));

        it("should return true for the System folder path", () =>
            testMatchesFilePath({
                expected: true,
                candidate: "/System",
                expectIsDirectoryCheck: false,
                isDirectory: false, // This will be ignored
            }));

        it("should return true for the System Library folder path", () =>
            testMatchesFilePath({
                expected: true,
                candidate: "/System/Library",
                expectIsDirectoryCheck: false,
                isDirectory: false, // This will be ignored
            }));
    });

    describe(MacOsFolderIconExtractor.prototype.extractFileIcons, () => {
        it("should return the correct icons for all provided file paths", async () => {
            const homePath = "homePath";
            const moduleAssetFolderPath = "moduleAssetFolderPath";

            const getPathMock = vi.fn().mockReturnValue(homePath);
            const getModuleAssetPath = vi.fn().mockImplementation((m, a) => join(moduleAssetFolderPath, a));

            const extractor = new MacOsFolderIconExtractor(
                <AssetPathResolver>{ getModuleAssetPath: (m, p) => getModuleAssetPath(m, p) },
                <FileSystemUtility>{},
                <App>{ getPath: (n) => getPathMock(n) },
            );

            const downloadsFolderPath = join(homePath, "Downloads");
            const someRandomFolderPath = join("some", "random", "folder");

            expect(await extractor.extractFileIcons([homePath, downloadsFolderPath, someRandomFolderPath])).toEqual({
                [homePath]: { url: `file://${join(moduleAssetFolderPath, "macOS", "HomeFolderIcon.png")}` },
                [downloadsFolderPath]: {
                    url: `file://${join(moduleAssetFolderPath, "macOS", "DownloadsFolderIcon.png")}`,
                },
                [someRandomFolderPath]: {
                    url: `file://${join(moduleAssetFolderPath, "macOS", "GenericFolderIcon.png")}`,
                },
            });

            expect(getPathMock).toHaveBeenCalledWith("home");
            expect(getModuleAssetPath).toHaveBeenCalledTimes(3);
        });
    });
});
