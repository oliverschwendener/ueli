import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Image } from "@common/Core/Image";
import { describe, expect, it, vi } from "vitest";
import { TerminalLauncherExtension } from "./TerminalLauncherExtension";

describe(TerminalLauncherExtension, () => {
    describe(TerminalLauncherExtension.prototype.getSearchResultItems, () => {
        it("should return an empty array", async () => {
            const extension = new TerminalLauncherExtension(null, null, null, null);
            const searchResultItems = await extension.getSearchResultItems();
            expect(searchResultItems).toEqual([]);
        });
    });

    describe(TerminalLauncherExtension.prototype.isSupported, () => {
        it("should return true for macOS and Windows", () =>
            expect(new TerminalLauncherExtension("macOS", null, null, null).isSupported()).toBe(true));

        it("should return false for Linux", () =>
            expect(new TerminalLauncherExtension("Linux", null, null, null).isSupported()).toBe(false));
    });

    describe(TerminalLauncherExtension.prototype.getSettingDefaultValue, () => {
        it("should return the default settings for macOS", () => {
            const extension = new TerminalLauncherExtension("macOS", null, null, null);
            expect(extension.getSettingDefaultValue("terminalIds")).toEqual(["Terminal"]);
        });

        it("should return the default settings for Windows", () => {
            const extension = new TerminalLauncherExtension("Windows", null, null, null);
            expect(extension.getSettingDefaultValue("terminalIds")).toEqual(["Command Prompt"]);
        });
    });

    describe(TerminalLauncherExtension.prototype.getSettingDefaultValue, () => {
        it("should return the default settings for macOS", () => {
            const extension = new TerminalLauncherExtension("macOS", null, null, null);
            expect(extension.getSettingDefaultValue<string[]>("terminalIds")).toEqual(["Terminal"]);
        });

        it("should return the default settings for Windows", () => {
            const extension = new TerminalLauncherExtension("Windows", null, null, null);
            expect(extension.getSettingDefaultValue<string[]>("terminalIds")).toEqual(["Command Prompt"]);
        });
    });

    describe(TerminalLauncherExtension.prototype.getImage, () => {
        it("should return an image", () => {
            const assetPathResolver = <AssetPathResolver>{
                getExtensionAssetPath: vi.fn().mockReturnValue("assets/images/windows-terminal.png"),
                getModuleAssetPath: vi.fn(),
            };

            const extension = new TerminalLauncherExtension(null, assetPathResolver, null, null);

            expect(extension.getImage()).toEqual(<Image>{ url: "file://assets/images/windows-terminal.png" });

            expect(assetPathResolver.getExtensionAssetPath).toHaveBeenCalledWith(
                "TerminalLauncher",
                "windows-terminal.png",
            );
        });
    });

    describe(TerminalLauncherExtension.prototype.getI18nResources, () =>
        it("should support en-US and de-CH", () =>
            expect(Object.keys(new TerminalLauncherExtension(null, null, null, null).getI18nResources())).toEqual([
                "en-US",
                "de-CH",
            ])),
    );

    describe(TerminalLauncherExtension.prototype.getAssetFilePath, () => {
        const testGetAssetFilePath = ({ expectedAssetName, key }: { expectedAssetName?: string; key: string }) => {
            const assetPathResolver = <AssetPathResolver>{
                getExtensionAssetPath: vi.fn().mockReturnValue("assetFilePath"),
                getModuleAssetPath: vi.fn(),
            };

            const extension = new TerminalLauncherExtension(null, assetPathResolver, null, null);

            expect(extension.getAssetFilePath(key)).toEqual("assetFilePath");
            expect(assetPathResolver.getExtensionAssetPath).toHaveBeenCalledWith("TerminalLauncher", expectedAssetName);
        };

        it("should return the image asset path when a valid terminal id is provided", () => {
            testGetAssetFilePath({ key: "Terminal", expectedAssetName: "terminal.png" });
            testGetAssetFilePath({ key: "iTerm", expectedAssetName: "iterm.png" });
            testGetAssetFilePath({ key: "Command Prompt", expectedAssetName: "command-prompt.png" });
            testGetAssetFilePath({ key: "Powershell", expectedAssetName: "powershell.png" });
            testGetAssetFilePath({ key: "Powershell Core", expectedAssetName: "powershell-core.svg" });
            testGetAssetFilePath({ key: "WSL", expectedAssetName: "wsl.png" });
        });
    });
});
