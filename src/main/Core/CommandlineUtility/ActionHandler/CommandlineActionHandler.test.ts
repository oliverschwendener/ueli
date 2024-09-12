import type { SearchResultItemAction } from "@common/Core";
import { describe, expect, it, vi } from "vitest";
import type { Logger } from "../../Logger";
import type { CommandlineUtility } from "../Contract";
import { CommandlineActionHandler } from "./CommandlineActionHandler";

describe(CommandlineActionHandler, () => {
    it("should execute commandline commands", async () => {
        const executeCommandMock = vi.fn();
        const commandlineUtility: CommandlineUtility = { executeCommand: (command) => executeCommandMock(command) };

        const loggerMock = { error: vi.fn() } as unknown as Logger;
        const actionHandler = new CommandlineActionHandler(commandlineUtility, loggerMock);
        await actionHandler.invokeAction(<SearchResultItemAction>{ argument: "command" });

        expect(actionHandler.id).toEqual("Commandline");
        expect(executeCommandMock).toHaveBeenLastCalledWith("command");
    });
});
