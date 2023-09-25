import type { ExecutionArgument } from "@common/ExecutionArgument";
import { describe, expect, it, vi } from "vitest";
import type { CommandlineUtility } from "../../Utilities";
import { CommandlineExecutionService } from "./CommandlineExecutionService";

describe(CommandlineExecutionService, () => {
    it("should execute commandline commands", () => {
        const executeCommandMock = vi.fn();

        const commandlineUtility = <CommandlineUtility>{
            executeCommand: (command) => executeCommandMock(command),
        };

        const executionArgument = <ExecutionArgument>{
            searchResultItem: {
                executionServiceArgument: "this is a commandline command",
            },
        };

        new CommandlineExecutionService(commandlineUtility).execute(executionArgument);

        expect(executeCommandMock).toHaveBeenLastCalledWith(
            executionArgument.searchResultItem.executionServiceArgument,
        );
    });
});
