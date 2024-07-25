import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { describe, expect, it, vi } from "vitest";
import { ColorConverterExtension } from "./ColorConverterExtension";
import { ColorConverterExtensionModule } from "./ColorConverterExtensionModule";
import { QixColorConverter } from "./QixColorConverter";

describe(ColorConverterExtensionModule, () => {
    describe(ColorConverterExtensionModule.prototype.bootstrap, () => {
        it("should bootstrap the extension", () => {
            const dependencyRegistry = <DependencyRegistry<Dependencies>>{
                get: vi.fn().mockReturnValue(null),
                register: null,
            };

            expect(new ColorConverterExtensionModule().bootstrap(dependencyRegistry)).toEqual({
                extension: new ColorConverterExtension(null, null, null, new QixColorConverter()),
            });

            expect(dependencyRegistry.get).toHaveBeenCalledWith("AssetPathResolver");
            expect(dependencyRegistry.get).toHaveBeenCalledWith("SettingsManager");
            expect(dependencyRegistry.get).toHaveBeenCalledWith("Translator");
        });
    });
});
