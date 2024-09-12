import type { ActionHandlerRegistry } from "@Core/ActionHandler";
import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { describe, expect, it, vi } from "vitest";
import { CommandlineActionHandler } from "./ActionHandler";
import { CommandlineUtilityModule } from "./CommandlineUtilityModule";
import { NodeJsCommandlineUtility } from "./NodeJsCommandlineUtility";

describe(CommandlineUtilityModule, () => {
    it("should register the NodeJsCommandlineUtility", () => {
        const actionHandlerRegistryMock: ActionHandlerRegistry = {
            register: vi.fn(),
            getAll: vi.fn(),
            getById: vi.fn(),
        };

        const dependencyRegistry: DependencyRegistry<Dependencies> = {
            get: vi.fn().mockReturnValue(actionHandlerRegistryMock),
            register: vi.fn(),
        };

        CommandlineUtilityModule.bootstrap(dependencyRegistry);

        expect(dependencyRegistry.register).toHaveBeenCalledWith("CommandlineUtility", new NodeJsCommandlineUtility());

        expect(dependencyRegistry.get).toBeCalledWith("ActionHandlerRegistry");

        const logger = dependencyRegistry.get("Logger");
        expect(actionHandlerRegistryMock.register).toHaveBeenCalledWith(
            new CommandlineActionHandler(new NodeJsCommandlineUtility(), logger),
        );
    });
});
