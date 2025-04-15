import type { Image } from "@common/Core/Image";
import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { FileSystemUtility } from "@Core/FileSystemUtility";
import type { FileImageGenerator } from "@Core/ImageGenerator";
import type { Logger } from "@Core/Logger";
import type { PowershellUtility } from "@Core/PowershellUtility";
import { describe, expect, it, vi } from "vitest";
import type { Settings } from "../Settings";
import { usePowershellScripts } from "./usePowershellScripts";
import { WindowsApplication } from "./WindowsApplication";
import { WindowsApplicationRepository } from "./WindowsApplicationRepository";
import type { WindowsApplicationRetrieverResult } from "./WindowsApplicationRetrieverResult";
import type { WindowsStoreApplication } from "./WindowsStoreApplication";

describe(WindowsApplicationRepository, () => {
    describe(WindowsApplicationRepository.prototype.getApplications, () => {
        const testGetApplications = async ({
            expected,
            includeWindowsStoreApps,
        }: {
            expected: WindowsApplication[];
            includeWindowsStoreApps: boolean;
        }) => {
            const folders = ["folder1", "folder2", "folder3"];
            const fileExtensions = ["ext1", "ext2"];

            const executeScriptMock = vi.fn().mockImplementation((s) => {
                if (s === usePowershellScripts().getWindowsStoreApps) {
                    return JSON.stringify(<WindowsStoreApplication[]>[
                        { AppId: "1234", DisplayName: "WindowsStoreApp1", LogoBase64: "Logo1" },
                        { AppId: "5678", DisplayName: "WindowsStoreApp2", LogoBase64: "Logo2" },
                    ]);
                } else {
                    return JSON.stringify(<WindowsApplicationRetrieverResult[]>[
                        { BaseName: "App1", FullName: "PathToApp1" },
                        { BaseName: "App2", FullName: "PathToApp2" },
                    ]);
                }
            });

            const powershellUtility = <PowershellUtility>{ executeScript: (s) => executeScriptMock(s) };

            const settings = <Settings>{
                getValue: (key) => {
                    if (key === "includeWindowsStoreApps") {
                        return includeWindowsStoreApps;
                    } else if (key === "windowsFolders") {
                        return folders;
                    } else if (key === "windowsFileExtensions") {
                        return fileExtensions;
                    }
                },
            };

            const getImagesMock = vi.fn().mockResolvedValue({ PathToApp1: <Image>{ url: "PathToIcon1" } });

            const fileImageGenerator = <FileImageGenerator>{ getImages: (f) => getImagesMock(f) };

            const isDirectoryMock = vi.fn().mockImplementation((path) => ["folder1", "folder2"].includes(path));

            const fileSystemUtility = <FileSystemUtility>{
                isDirectory: (path) => isDirectoryMock(path),
            };

            const warnMock = vi.fn();

            const logger = <Logger>{ warn: (m) => warnMock(m) };

            const getExtensionAssetPathMock = vi.fn().mockReturnValue("path");

            const assetPathResolver = <AssetPathResolver>{
                getExtensionAssetPath: (e, a) => getExtensionAssetPathMock(e, a),
            };

            const windowsApplicationRepository = new WindowsApplicationRepository(
                powershellUtility,
                settings,
                fileSystemUtility,
                fileImageGenerator,
                logger,
                assetPathResolver,
            );

            expect(await windowsApplicationRepository.getApplications()).toEqual(expected);
            expect(executeScriptMock).toHaveBeenCalledTimes(includeWindowsStoreApps ? 2 : 1);
            expect(getImagesMock).toHaveBeenCalledWith(["PathToApp1", "PathToApp2"]);
            expect(isDirectoryMock).toHaveBeenCalledTimes(3);
            expect(getExtensionAssetPathMock).toHaveBeenCalledWith("ApplicationSearch", "windows-generic-app-icon.png");
            expect(warnMock).toHaveBeenCalledTimes(2);
            expect(warnMock).toHaveBeenCalledWith(
                "Unable to get applications from folder \"folder3\". Reason: path doesn't exist or isn't a folder",
            );
            expect(warnMock).toHaveBeenCalledWith(
                'Failed to generate icon for "PathToApp2". Using generic icon instead',
            );
        };

        it("should return manually installed apps and windows store apps when 'include apps from windows store is enabled'", async () =>
            await testGetApplications({
                expected: [
                    new WindowsApplication("App1", "PathToApp1", { url: "PathToIcon1" }, { filePath: "PathToApp1" }),
                    new WindowsApplication("App2", "PathToApp2", { url: "file://path" }, { filePath: "PathToApp2" }),
                    new WindowsApplication("WindowsStoreApp1", "shell:AppsFolder\\1234", {
                        url: "data:image/png;base64,Logo1",
                    }),
                    new WindowsApplication("WindowsStoreApp2", "shell:AppsFolder\\5678", {
                        url: "data:image/png;base64,Logo2",
                    }),
                ],
                includeWindowsStoreApps: true,
            }));

        it("should return only manually installed apps and when 'include apps from windows store is disabled'", async () =>
            await testGetApplications({
                expected: [
                    new WindowsApplication("App1", "PathToApp1", { url: "PathToIcon1" }, { filePath: "PathToApp1" }),
                    new WindowsApplication("App2", "PathToApp2", { url: "file://path" }, { filePath: "PathToApp2" }),
                ],
                includeWindowsStoreApps: false,
            }));
    });
});
