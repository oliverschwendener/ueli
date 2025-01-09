import type { SearchResultItemAction } from "@common/Core";
import { describe, expect, it, vi } from "vitest";
import type { BrowserWindowRegistry } from "../../BrowserWindowRegistry";
import type { CommandlineUtility } from "../Contract";
import { CommandlineActionHandler } from "./CommandlineActionHandler";

const browserRegistryMock = {
    getById: () => {
        return { show: vi.fn(), hide: vi.fn() };
    },
} as unknown as BrowserWindowRegistry;

describe(CommandlineActionHandler, () => {
    it("should execute commandline commands", async () => {
        const executeCommandMock = vi.fn();
        const commandlineUtility = <CommandlineUtility>{ executeCommand: (command) => executeCommandMock(command) };

        const actionHandler = new CommandlineActionHandler(commandlineUtility, browserRegistryMock);
        await actionHandler.invokeAction(<SearchResultItemAction>{ argument: "command" });

        expect(actionHandler.id).toEqual("Commandline");
        expect(executeCommandMock).toHaveBeenLastCalledWith("command");
    });
});
