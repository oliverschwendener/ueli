import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { EnvironmentVariableProvider } from "@Core/EnvironmentVariableProvider";
import type { FileSystemUtility } from "@Core/FileSystemUtility";
import type { FileImageGenerator } from "@Core/ImageGenerator";
import type { IniFileParser } from "@Core/IniFileParser";
import type { Logger } from "@Core/Logger";
import type { Image } from "@common/Core/Image";
import { describe, expect, it, vi } from "vitest";
import type { Settings } from "../Settings";
import { LinuxApplication } from "./LinuxApplication";
import { LinuxApplicationRepository } from "./LinuxApplicationRepository";

describe(LinuxApplicationRepository, () => {
    describe(LinuxApplicationRepository.prototype.getApplications, () => {
        const mockFilePaths: Record<string, string[]> = {
            "/usr/share/applications": [
                "/usr/share/applications/org.app1.desktop",
                "/usr/share/applications/app2.desktop",
                "/usr/share/applications/app3.desktop",
                "/usr/share/applications/app4.desktop",
            ],
            "/home/user/my/folder/applications": ["/home/user/my/folder/applications/app5.desktop"],
        };

        const mockDesktopFiles: Record<string, Record<string, Record<string, string>>> = {
            // Standard apps, show on all desktops
            "/usr/share/applications/org.app1.desktop": {
                "Desktop Entry": {
                    Name: "App1",
                    Icon: "app1",
                },
            },
            "/home/user/my/folder/applications/app5.desktop": {
                "Desktop Entry": {
                    Name: "App5",
                    Icon: "doesntExist",
                },
            },
            // NoDisplay, shouldn't show for any desktop
            "/usr/share/applications/app2.desktop": {
                "Desktop Entry": {
                    Name: "App2",
                    Icon: "app2",
                    NoDisplay: "true",
                },
            },
            // OnlyShowIn Desktop1
            "/usr/share/applications/app3.desktop": {
                "Desktop Entry": {
                    Name: "App3",
                    Icon: "app3",
                    OnlyShowIn: "Desktop1;",
                },
            },
            // NotShowIn Desktop1
            "/usr/share/applications/app4.desktop": {
                "Desktop Entry": {
                    Name: "App4",
                    Icon: "app4",
                    NotShowIn: "Desktop1;",
                },
            },
        };

        const getSettingsMock = vi.fn().mockImplementation((v) => {
            if (v === "linuxFolders") {
                return [
                    "/usr/share/applications",
                    "/usr/local/share/applications",
                    "/home/user/my/folder/applications",
                ];
            }

            return undefined;
        });
        const mockSettings = <Settings>{
            getValue: (v) => getSettingsMock(v),
            getDefaultValue: (v) => getSettingsMock(v),
        };

        const isDirectoryMock = vi.fn().mockImplementation((path) => Object.keys(mockFilePaths).includes(path));
        const readDirectoryMock = vi.fn().mockImplementation((path) => {
            const files = mockFilePaths[path];

            if (files) {
                return files;
            }

            throw new Error(`Directory ${path} does not exist.`);
        });
        const readFileMock = vi.fn().mockImplementation((path) => {
            if (Object.keys(mockDesktopFiles).includes(path)) {
                return path;
            }

            throw new Error(`File ${path} does not exist`);
        });

        const mockFileSystemUtility = <FileSystemUtility>{
            isDirectory: (path) => isDirectoryMock(path),
            readDirectory: (path) => readDirectoryMock(path),
            readFile: (path) => readFileMock(path),
        };

        const getImageMock = vi.fn().mockImplementation((file) => {
            const icon = mockDesktopFiles[file]["Desktop Entry"]["Icon"];

            if (!icon || icon === "doesntExist") {
                throw new Error(`Icon ${file} doesn't exist.`);
            }

            return <Image>{
                url: `file:///url/to/icon/${icon}.png`,
            };
        });
        const getImagesMock = vi.fn().mockImplementation((filePaths) => {
            const images: Record<string, Image> = {};

            for (const file of filePaths) {
                const icon = mockDesktopFiles[file]["Desktop Entry"]["Icon"];

                if (!icon || icon === "doesntExist") {
                    throw new Error(`Icon ${file} doesn't exist.`);
                }

                images[file] = <Image>{
                    url: `file:///url/to/icon/${icon}.png`,
                };
            }

            return images;
        });
        const mockFileImageGenerator = <FileImageGenerator>{
            getImage: (filePath) => getImageMock(filePath),
            getImages: (filePaths) => getImagesMock(filePaths),
        };

        const parseIniMock = vi.fn().mockImplementation((fileString) => mockDesktopFiles[fileString]);
        const mockIniParser = <IniFileParser>{
            parseIniFileContent: (fileString) => parseIniMock(fileString),
        };

        const getEnvironmentVariableMock = vi.fn().mockImplementation((env) => {
            if (env === "ORIGINAL_XDG_CURRENT_DESKTOP") {
                return "Desktop1";
            }

            return undefined;
        });
        const getAllEnvironmentVariableMock = vi.fn().mockReturnValue({
            ORIGINAL_XDG_CURRENT_DESKTOP: "Desktop1",
        });
        const mockEnvironmentVariableProvider = <EnvironmentVariableProvider>{
            get: (env) => getEnvironmentVariableMock(env),
            getAll: () => getAllEnvironmentVariableMock(),
        };

        const getExtensionAssetPathMock = vi.fn().mockReturnValue("genericIcon.png");
        const mockAssetPathResolver = <AssetPathResolver>{
            getExtensionAssetPath: (e, a) => getExtensionAssetPathMock(e, a),
        };

        const warnMock = vi.fn();
        const errorMock = vi.fn();
        const mockLogger = <Logger>{ warn: (m) => warnMock(m), error: (m) => errorMock(m) };

        // return a list of all applications given in list
        it("should return all applications for the current desktop", async () => {
            const linuxApplicationRepository = new LinuxApplicationRepository(
                mockFileSystemUtility,
                mockFileImageGenerator,
                mockIniParser,
                mockEnvironmentVariableProvider,
                mockAssetPathResolver,
                mockLogger,
                mockSettings,
            );

            expect(await linuxApplicationRepository.getApplications()).toEqual([
                new LinuxApplication("App1", "/usr/share/applications/org.app1.desktop", <Image>{
                    url: "file:///url/to/icon/app1.png",
                }),
                new LinuxApplication("App3", "/usr/share/applications/app3.desktop", <Image>{
                    url: "file:///url/to/icon/app3.png",
                }),
                new LinuxApplication("App5", "/home/user/my/folder/applications/app5.desktop", <Image>{
                    url: "file://genericIcon.png",
                }),
            ]);
        });
    });
});
