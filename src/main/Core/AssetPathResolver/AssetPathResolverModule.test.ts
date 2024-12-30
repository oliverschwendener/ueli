import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { describe, expect, it, vi } from "vitest";
import { AssetPathResolver } from "./AssetPathResolver";
import { AssetPathResolverModule } from "./AssetPathResolverModule";

describe(AssetPathResolverModule, () => {
    it("should register the AssetPathResolver", () => {
        const moduleRegistry = <UeliModuleRegistry>{
            get: vi.fn(),
            register: vi.fn(),
        };

        AssetPathResolverModule.bootstrap(moduleRegistry);

        expect(moduleRegistry.register).toHaveBeenCalledWith("AssetPathResolver", new AssetPathResolver());
    });
});
