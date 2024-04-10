import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { describe, expect, it, vi } from "vitest";
import { CommandlineUtilityModule } from "./CommandlineUtilityModule";
import { NodeJsCommandlineUtility } from "./NodeJsCommandlineUtility";

describe(CommandlineUtilityModule, () => {
    it("should register the NodeJsCommandlineUtility", () => {
        const dependencyRegistry = <DependencyRegistry<Dependencies>>{
            get: vi.fn(),
            register: vi.fn(),
        };

        CommandlineUtilityModule.bootstrap(dependencyRegistry);

        expect(dependencyRegistry.register).toHaveBeenCalledWith("CommandlineUtility", new NodeJsCommandlineUtility());
    });
});
