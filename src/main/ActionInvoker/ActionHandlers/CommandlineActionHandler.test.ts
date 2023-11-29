import type { SearchResultItemAction } from "@common/SearchResultItemAction";
import { describe, expect, it, vi } from "vitest";
import type { CommandlineUtility } from "../../CommandlineUtility";
import { CommandlineActionHandler } from "./CommandlineActionHandler";

describe(CommandlineActionHandler, () => {
    it("should execute commandline commands", () => {
        const executeCommandMock = vi.fn();

        const commandlineUtility = <CommandlineUtility>{
            executeCommand: (command) => executeCommandMock(command),
        };

        const action = <SearchResultItemAction>{
            argument: "this is a commandline command",
        };

        new CommandlineActionHandler(commandlineUtility).invoke(action);

        expect(executeCommandMock).toHaveBeenLastCalledWith(action.argument);
    });
});
