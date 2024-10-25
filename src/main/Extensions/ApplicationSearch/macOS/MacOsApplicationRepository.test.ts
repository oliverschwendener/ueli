import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { CommandlineUtility } from "@Core/CommandlineUtility";
import type { FileImageGenerator } from "@Core/ImageGenerator";
import type { Logger } from "@Core/Logger";
import { describe, expect, it, vi } from "vitest";
import type { Settings } from "../Settings";
import { MacOsApplication } from "./MacOsApplication";
import { MacOsApplicationRepository } from "./MacOsApplicationRepository";

describe(MacOsApplicationRepository, () => {
    describe(MacOsApplicationRepository.prototype.getApplications, () => {
        it("should return all applications", async () => {
            const getValueMock = vi.fn().mockImplementation((key) => {
                if (key === "mdfindFilterOption") {
                    return undefined;
                } else if (key === "macOsFolders") {
                    return ["/Applications"];
                }
            });
            const getDefaultValueMock = vi.fn().mockImplementation((key) => {
                if (key === "mdfindFilterOption") {
                    return "kMDItemKind=='Application'";
                } else if (key === "macOsFolders") {
                    return ["/Applications"];
                }
            });

            const settings = <Settings>{
                getValue: (k) => getValueMock(k),
                getDefaultValue: (k) => getDefaultValueMock(k),
            };

            const executeCommandMock = vi.fn().mockResolvedValue(`
                .
                ..
                /Applications/iTerm.app
                /Applications/Sketch.app
                /Applications/Finder.app
                /Applications/Something Else.png
                /Applications/SomeApp.app/SubApp.app
                /Other/Folder/OtherApp.app
            `);

            const commandlineUtility = <CommandlineUtility>{
                executeCommand: (c, istd, ierr) => executeCommandMock(c, istd, ierr),
            };

            const getImagesMock = vi.fn().mockResolvedValue({
                "/Applications/iTerm.app": { url: "iterm.png" },
                "/Applications/Sketch.app": { url: "sketch.png" },
            });

            const fileImageGenerator = <FileImageGenerator>{
                getImages: (f) => getImagesMock(f),
            };

            const warnMock = vi.fn();

            const logger = <Logger>{ warn: (m) => warnMock(m) };

            const getExtensionAssetPathMock = vi.fn().mockReturnValue("genericIcon.png");

            const assetPathResolver = <AssetPathResolver>{
                getExtensionAssetPath: (e, a) => getExtensionAssetPathMock(e, a),
            };

            const macosApplicationRepository = new MacOsApplicationRepository(
                commandlineUtility,
                fileImageGenerator,
                logger,
                settings,
                assetPathResolver,
            );

            expect(await macosApplicationRepository.getApplications()).toEqual([
                new MacOsApplication("iTerm", "/Applications/iTerm.app", { url: "iterm.png" }),
                new MacOsApplication("Sketch", "/Applications/Sketch.app", { url: "sketch.png" }),
                new MacOsApplication("Finder", "/Applications/Finder.app", { url: "file://genericIcon.png" }),
            ]);

            expect(executeCommandMock).toHaveBeenCalledWith(
                `mdfind "kMDItemKind == 'Application'"`,
                undefined,
                undefined,
            );

            expect(getImagesMock).toHaveBeenCalledWith([
                "/Applications/iTerm.app",
                "/Applications/Sketch.app",
                "/Applications/Finder.app",
            ]);

            expect(warnMock).toHaveBeenCalledWith(
                `Failed to generate icon for "/Applications/Finder.app". Using generic icon instead.`,
            );

            expect(getExtensionAssetPathMock).toHaveBeenCalledWith("ApplicationSearch", "macos-generic-app-icon.png");
        });
    });
});
