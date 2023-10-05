import type { CommandlineUtility } from "@common/CommandlineUtility";
import type { ExecutionArgument } from "@common/ExecutionArgument";
import { describe, expect, it, vi } from "vitest";
import { PowershellExecutionService } from "./PowershellExecutionService";

describe(PowershellExecutionService, () => {
    it("should execute powershell commands", () => {
        const executeCommandMock = vi.fn();

        const commandlineUtility = <CommandlineUtility>{
            executeCommand: (command) => executeCommandMock(command),
        };

        const executionArgument = <ExecutionArgument>{
            searchResultItem: {
                executionServiceArgument: "this is my powershell command",
            },
        };

        new PowershellExecutionService(commandlineUtility).execute(executionArgument);

        expect(executeCommandMock).toHaveBeenCalledWith(
            `powershell -Command "& {${executionArgument.searchResultItem.executionServiceArgument}}"`,
        );
    });
});
