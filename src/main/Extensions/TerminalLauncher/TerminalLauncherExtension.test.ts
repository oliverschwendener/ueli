import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { TerminalRegistry } from "@Core/Terminal";
import { describe, expect, it, vi } from "vitest";
import { TerminalLauncherExtension } from "./TerminalLauncherExtension";

describe(TerminalLauncherExtension, () => {
    describe(TerminalLauncherExtension.prototype.id, () =>
        it(`should be "TerminalLauncher"`, () =>
            expect(new TerminalLauncherExtension(null, null, null, null, null).id).toBe("TerminalLauncher")),
    );

    describe(TerminalLauncherExtension.prototype.name, () =>
        it(`should be "Terminal Launcher"`, () =>
            expect(new TerminalLauncherExtension(null, null, null, null, null).name).toBe("Terminal Launcher")),
    );

    describe("author", () =>
        it(`should be "Oliver Schwendener"`, () =>
            expect(new TerminalLauncherExtension(null, null, null, null, null).author.name).toBe(
                "Oliver Schwendener",
            )));

    describe(TerminalLauncherExtension.prototype.getSearchResultItems, () =>
        it("should return an empty array", async () =>
            expect(await new TerminalLauncherExtension(null, null, null, null, null).getSearchResultItems()).toEqual(
                [],
            )),
    );

    describe(TerminalLauncherExtension.prototype.isSupported, () => {
        it("should return true for macOS", () =>
            expect(new TerminalLauncherExtension("macOS", null, null, null, null).isSupported()).toBe(true));

        it("should return true for Windows", () =>
            expect(new TerminalLauncherExtension("Windows", null, null, null, null).isSupported()).toBe(true));

        it("should return false for Linux", () =>
            expect(new TerminalLauncherExtension("Linux", null, null, null, null).isSupported()).toBe(false));
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

            const extension = new TerminalLauncherExtension(null, null, null, null, terminalRegistry);

            expect(extension.getSettingDefaultValue<string[]>("terminalIds")).toEqual(["1", "3"]);
        });

        it("should return undefined when the key is not found", () => {
            const terminalRegistry = <TerminalRegistry>{
                getAll: vi.fn().mockReturnValue([]),
                getById: vi.fn(),
            };

            const extension = new TerminalLauncherExtension(null, null, null, null, terminalRegistry);
            expect(extension.getSettingDefaultValue<string[]>("something")).toBeUndefined();
        });
    });

    describe(TerminalLauncherExtension.prototype.getImage, () => {
        it("should return the image URL", () => {
            const assetPathResolver = <AssetPathResolver>{
                getExtensionAssetPath: vi.fn(),
                getModuleAssetPath: vi.fn().mockReturnValue("path/to/image"),
            };

            const actual = new TerminalLauncherExtension(null, assetPathResolver, null, null, null).getImage();

            expect(actual).toEqual({ url: "file://path/to/image" });

            expect(assetPathResolver.getModuleAssetPath).toHaveBeenCalledOnce();
            expect(assetPathResolver.getModuleAssetPath).toHaveBeenCalledWith("Terminal", "windows-terminal.png");
        });
    });

    describe(TerminalLauncherExtension.prototype.getI18nResources, () => {
        it("should return i18n resources for en-US and de-CH", () => {
            const extension = new TerminalLauncherExtension(null, null, null, null, null);
            expect(Object.keys(extension.getI18nResources())).toEqual(["en-US", "de-CH"]);
        });
    });
});
