import type { ActionHandlerRegistry } from "@Core/ActionHandler";
import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { describe, expect, it, vi } from "vitest";
import { CommandlineActionHandler } from "./ActionHandler";
import { CommandlineUtilityModule } from "./CommandlineUtilityModule";
import { NodeJsCommandlineUtility } from "./NodeJsCommandlineUtility";

describe(CommandlineUtilityModule, () => {
    it("should register the NodeJsCommandlineUtility", () => {
        const actionHandlerRegistryMock = <ActionHandlerRegistry>{
            register: vi.fn(),
            getAll: vi.fn(),
            getById: vi.fn(),
        };

        const moduleRegistry = <UeliModuleRegistry>{
            get: vi.fn().mockReturnValue(actionHandlerRegistryMock),
            register: vi.fn(),
        };

        CommandlineUtilityModule.bootstrap(moduleRegistry);

        expect(moduleRegistry.register).toHaveBeenCalledWith("CommandlineUtility", new NodeJsCommandlineUtility());

        expect(moduleRegistry.get).toBeCalledWith("ActionHandlerRegistry");
        expect(actionHandlerRegistryMock.register).toHaveBeenCalledWith(
            new CommandlineActionHandler(new NodeJsCommandlineUtility()),
        );
    });
});
