import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import type { SettingsManager } from "@Core/SettingsManager";
import type { Translator } from "@Core/Translator";
import { describe, expect, it, vi } from "vitest";
import { ColorConverterExtension } from "./ColorConverterExtension";
import { ColorConverterExtensionModule } from "./ColorConverterExtensionModule";
import { QixColorConverter } from "./QixColorConverter";

describe(ColorConverterExtensionModule, () => {
    describe(ColorConverterExtensionModule.prototype.bootstrap, () => {
        it("should bootstrap the extension", () => {
            const assetPathResolver = <AssetPathResolver>{};
            const settingsManager = <SettingsManager>{};
            const translator = <Translator>{};

            const moduleRegistry = <UeliModuleRegistry>{
                get: vi.fn().mockImplementation((n: string) => {
                    if (n === "AssetPathResolver") {
                        return assetPathResolver;
                    } else if (n === "SettingsManager") {
                        return settingsManager;
                    } else if (n === "Translator") {
                        return translator;
                    }

                    return null;
                }),
                register: () => null,
            };

            expect(new ColorConverterExtensionModule().bootstrap(moduleRegistry)).toEqual({
                extension: new ColorConverterExtension(
                    assetPathResolver,
                    settingsManager,
                    translator,
                    new QixColorConverter(),
                ),
            });

            expect(moduleRegistry.get).toHaveBeenCalledWith("AssetPathResolver");
            expect(moduleRegistry.get).toHaveBeenCalledWith("SettingsManager");
            expect(moduleRegistry.get).toHaveBeenCalledWith("Translator");
        });
    });
});
