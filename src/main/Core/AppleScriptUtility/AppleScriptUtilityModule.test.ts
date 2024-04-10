import type { CommandlineUtility } from "@Core/CommandlineUtility";
import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { describe, expect, it, vi } from "vitest";
import { AppleScriptUtility } from "./AppleScriptUtility";
import { AppleScriptUtilityModule } from "./AppleScriptUtilityModule";

describe(AppleScriptUtilityModule, () => {
    it("should register the AppleScriptUtility", () => {
        const commandlineUtility = <CommandlineUtility>{};

        const dependencyRegistry = <DependencyRegistry<Dependencies>>{
            get: vi.fn().mockReturnValue(commandlineUtility),
            register: vi.fn(),
        };

        AppleScriptUtilityModule.bootstrap(dependencyRegistry);

        expect(dependencyRegistry.get).toHaveBeenCalledWith("CommandlineUtility");

        expect(dependencyRegistry.register).toHaveBeenCalledWith(
            "AppleScriptUtility",
            new AppleScriptUtility(commandlineUtility),
        );
    });
});
