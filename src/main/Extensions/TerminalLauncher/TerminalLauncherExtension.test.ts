import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { SettingsManager } from "@Core/SettingsManager";
import type { TerminalRegistry } from "@Core/Terminal";
import type { Translator } from "@Core/Translator";
import { describe, expect, it, vi } from "vitest";
import { TerminalLauncherExtension } from "./TerminalLauncherExtension";

describe(TerminalLauncherExtension, () => {
    describe(TerminalLauncherExtension.prototype.id, () =>
        it(`should be "TerminalLauncher"`, () =>
            expect(
                new TerminalLauncherExtension(
                    "Windows",
                    <AssetPathResolver>{},
                    <SettingsManager>{},
                    <Translator>{},
                    <TerminalRegistry>{},
                ).id,
            ).toBe("TerminalLauncher")),
    );

    describe(TerminalLauncherExtension.prototype.name, () =>
        it(`should be "Terminal Launcher"`, () =>
            expect(
                new TerminalLauncherExtension(
                    "Windows",
                    <AssetPathResolver>{},
                    <SettingsManager>{},
                    <Translator>{},
                    <TerminalRegistry>{},
                ).name,
            ).toBe("Terminal Launcher")),
    );

    describe("author", () =>
        it(`should be "Oliver Schwendener"`, () =>
            expect(
                new TerminalLauncherExtension(
                    "Windows",
                    <AssetPathResolver>{},
                    <SettingsManager>{},
                    <Translator>{},
                    <TerminalRegistry>{},
                ).author.name,
            ).toBe("Oliver Schwendener")));

    describe(TerminalLauncherExtension.prototype.getSearchResultItems, () =>
        it("should return an empty array", async () =>
            expect(
                await new TerminalLauncherExtension(
                    "Windows",
                    <AssetPathResolver>{},
                    <SettingsManager>{},
                    <Translator>{},
                    <TerminalRegistry>{},
                ).getSearchResultItems(),
            ).toEqual([])),
    );

    describe(TerminalLauncherExtension.prototype.isSupported, () => {
        it("should return true for macOS", () =>
            expect(
                new TerminalLauncherExtension(
                    "macOS",
                    <AssetPathResolver>{},
                    <SettingsManager>{},
                    <Translator>{},
                    <TerminalRegistry>{},
                ).isSupported(),
            ).toBe(true));

        it("should return true for Windows", () =>
            expect(
                new TerminalLauncherExtension(
                    "Windows",
                    <AssetPathResolver>{},
                    <SettingsManager>{},
                    <Translator>{},
                    <TerminalRegistry>{},
                ).isSupported(),
            ).toBe(true));

        it("should return false for Linux", () =>
            expect(
                new TerminalLauncherExtension(
                    "Linux",
                    <AssetPathResolver>{},
                    <SettingsManager>{},
                    <Translator>{},
                    <TerminalRegistry>{},
                ).isSupported(),
            ).toBe(false));
    });

    describe(TerminalLauncherExtension.prototype.getSettingDefaultValue, () => {
        it("should the terminal ids of the default terminals when passing in 'terminals'", () => {
            const terminalRegistry = <TerminalRegistry>{
                getAll: vi.fn().mockReturnValue([
                    { terminalId: "1", isEnabledByDefault: true },
                    { terminalId: "2", isEnabledByDefault: false },
                    { terminalId: "3", isEnabledByDefault: true },
                ]),
                getById: vi.fn(),
            };

            const extension = new TerminalLauncherExtension(
                "Windows",
                <AssetPathResolver>{},
                <SettingsManager>{},
                <Translator>{},
                terminalRegistry,
            );

            expect(extension.getSettingDefaultValue("terminalIds")).toEqual(["1", "3"]);
        });
    });

    describe(TerminalLauncherExtension.prototype.getImage, () => {
        it("should return the image URL", () => {
            const assetPathResolver = <AssetPathResolver>{
                getExtensionAssetPath: vi.fn(),
                getModuleAssetPath: vi.fn().mockReturnValue("path/to/image"),
            };

            const actual = new TerminalLauncherExtension(
                "Windows",
                assetPathResolver,
                <SettingsManager>{},
                <Translator>{},
                <TerminalRegistry>{},
            ).getImage();

            expect(actual).toEqual({ url: "file://path/to/image" });

            expect(assetPathResolver.getModuleAssetPath).toHaveBeenCalledOnce();
            expect(assetPathResolver.getModuleAssetPath).toHaveBeenCalledWith("Terminal", "windows-terminal.png");
        });
    });

    describe(TerminalLauncherExtension.prototype.getI18nResources, () => {
        it("should return i18n resources for en-US, de-CH, ja-JP and ko-KR", () => {
            const extension = new TerminalLauncherExtension(
                "Windows",
                <AssetPathResolver>{},
                <SettingsManager>{},
                <Translator>{},
                <TerminalRegistry>{},
            );
            expect(Object.keys(extension.getI18nResources())).toEqual(["en-US", "de-CH", "ja-JP", "ko-KR"]);
        });
    });
});
