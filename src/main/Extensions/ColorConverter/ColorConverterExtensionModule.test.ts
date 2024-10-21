import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
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

            const dependencyRegistry = <DependencyRegistry<Dependencies>>{
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

            expect(new ColorConverterExtensionModule().bootstrap(dependencyRegistry)).toEqual({
                extension: new ColorConverterExtension(
                    assetPathResolver,
                    settingsManager,
                    translator,
                    new QixColorConverter(),
                ),
            });

            expect(dependencyRegistry.get).toHaveBeenCalledWith("AssetPathResolver");
            expect(dependencyRegistry.get).toHaveBeenCalledWith("SettingsManager");
            expect(dependencyRegistry.get).toHaveBeenCalledWith("Translator");
        });
    });
});
