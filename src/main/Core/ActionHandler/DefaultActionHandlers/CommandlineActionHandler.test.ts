import type { SearchResultItemAction } from "@common/Core";
import { describe, expect, it, vi } from "vitest";
import type { CommandlineUtility } from "../../CommandlineUtility";
import { CommandlineActionHandler } from "./CommandlineActionHandler";

describe(CommandlineActionHandler, () => {
    it("should execute commandline commands", async () => {
        const executeCommandMock = vi.fn();
        const commandlineUtility = <CommandlineUtility>{ executeCommand: (command) => executeCommandMock(command) };

        const actionHandler = new CommandlineActionHandler(commandlineUtility);
        await actionHandler.invokeAction(<SearchResultItemAction>{ argument: "command" });

        expect(actionHandler.id).toEqual("Commandline");
        expect(executeCommandMock).toHaveBeenLastCalledWith("command");
    });
});
