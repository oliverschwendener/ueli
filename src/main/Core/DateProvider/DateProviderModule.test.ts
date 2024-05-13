import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { describe, expect, it, vi } from "vitest";
import { DateProvider } from "./DateProvider";
import { DateProviderModule } from "./DateProviderModule";

describe(DateProviderModule, () => {
    it("should register the date provider", () => {
        const dependencyRegistry = <DependencyRegistry<Dependencies>>{
            get: vi.fn(),
            register: vi.fn(),
        };

        DateProviderModule.bootstrap(dependencyRegistry);

        expect(dependencyRegistry.register).toHaveBeenCalledWith("DateProvider", new DateProvider());
    });
});
