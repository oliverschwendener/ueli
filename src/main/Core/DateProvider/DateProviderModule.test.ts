import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { describe, expect, it, vi } from "vitest";
import { DateProvider } from "./DateProvider";
import { DateProviderModule } from "./DateProviderModule";

describe(DateProviderModule, () => {
    it("should register the date provider", () => {
        const moduleRegistry = <UeliModuleRegistry>{
            get: vi.fn(),
            register: vi.fn(),
        };

        DateProviderModule.bootstrap(moduleRegistry);

        expect(moduleRegistry.register).toHaveBeenCalledWith("DateProvider", new DateProvider());
    });
});
