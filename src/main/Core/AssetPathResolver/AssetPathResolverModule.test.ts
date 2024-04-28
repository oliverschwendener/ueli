import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { describe, expect, it, vi } from "vitest";
import { AssetPathResolver } from "./AssetPathResolver";
import { AssetPathResolverModule } from "./AssetPathResolverModule";

describe(AssetPathResolverModule, () => {
    it("should register the AssetPathResolver", () => {
        const dependencyRegistry = <DependencyRegistry<Dependencies>>{
            get: vi.fn(),
            register: vi.fn(),
        };

        AssetPathResolverModule.bootstrap(dependencyRegistry);

        expect(dependencyRegistry.register).toHaveBeenCalledWith("AssetPathResolver", new AssetPathResolver());
    });
});
