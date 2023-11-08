import type { CommandlineUtility } from "@common/CommandlineUtility";
import type { SearchResultItem } from "@common/SearchResultItem";
import { describe, expect, it, vi } from "vitest";
import { CommandlineExecutionService } from "./CommandlineExecutionService";

describe(CommandlineExecutionService, () => {
    it("should execute commandline commands", () => {
        const executeCommandMock = vi.fn();

        const commandlineUtility = <CommandlineUtility>{
            executeCommand: (command) => executeCommandMock(command),
        };

        const searchResultItem = <SearchResultItem>{
            executionServiceArgument: "this is a commandline command",
        };

        new CommandlineExecutionService(commandlineUtility).execute(searchResultItem);

        expect(executeCommandMock).toHaveBeenLastCalledWith(searchResultItem.executionServiceArgument);
    });
});
