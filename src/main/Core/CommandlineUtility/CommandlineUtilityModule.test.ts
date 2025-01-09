import type { ActionHandlerRegistry } from "@Core/ActionHandler";
import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { describe, expect, it, vi } from "vitest";
import type { BrowserWindowRegistry } from "../BrowserWindowRegistry";
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

        const browserRegistryMock = {
            getAll: vi.fn(),
            getById: vi.fn(),
            register: vi.fn(),
        } as unknown as BrowserWindowRegistry;

        const moduleRegistry = <UeliModuleRegistry>{
            get: vi.fn().mockReturnValueOnce(browserRegistryMock).mockReturnValueOnce(actionHandlerRegistryMock),
            register: vi.fn(),
        };

        CommandlineUtilityModule.bootstrap(moduleRegistry);

        expect(moduleRegistry.register).toHaveBeenCalledWith("CommandlineUtility", new NodeJsCommandlineUtility());

        expect(moduleRegistry.get).toHaveBeenNthCalledWith(1, "BrowserWindowRegistry");
        expect(moduleRegistry.get).toHaveBeenNthCalledWith(2, "ActionHandlerRegistry");
        expect(actionHandlerRegistryMock.register).toHaveBeenCalledWith(
            new CommandlineActionHandler(new NodeJsCommandlineUtility(), browserRegistryMock),
        );
    });
});
