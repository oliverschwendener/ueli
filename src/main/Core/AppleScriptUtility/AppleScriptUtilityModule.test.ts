import type { CommandlineUtility } from "@Core/CommandlineUtility";
import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { describe, expect, it, vi } from "vitest";
import { AppleScriptUtility } from "./AppleScriptUtility";
import { AppleScriptUtilityModule } from "./AppleScriptUtilityModule";

describe(AppleScriptUtilityModule, () => {
    it("should register the AppleScriptUtility", () => {
        const commandlineUtility = <CommandlineUtility>{};

        const moduleRegistry = <UeliModuleRegistry>{
            get: vi.fn().mockReturnValue(commandlineUtility),
            register: vi.fn(),
        };

        AppleScriptUtilityModule.bootstrap(moduleRegistry);

        expect(moduleRegistry.get).toHaveBeenCalledWith("CommandlineUtility");

        expect(moduleRegistry.register).toHaveBeenCalledWith(
            "AppleScriptUtility",
            new AppleScriptUtility(commandlineUtility),
        );
    });
});
