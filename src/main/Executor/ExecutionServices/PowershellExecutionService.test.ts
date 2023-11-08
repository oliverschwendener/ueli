import type { CommandlineUtility } from "@common/CommandlineUtility";
import type { SearchResultItem } from "@common/SearchResultItem";
import { describe, expect, it, vi } from "vitest";
import { PowershellExecutionService } from "./PowershellExecutionService";

describe(PowershellExecutionService, () => {
    it("should execute powershell commands", () => {
        const executeCommandMock = vi.fn();

        const commandlineUtility = <CommandlineUtility>{
            executeCommand: (command) => executeCommandMock(command),
        };

        const searchResultItem = <SearchResultItem>{
            executionServiceArgument: "this is my powershell command",
        };

        new PowershellExecutionService(commandlineUtility).execute(searchResultItem);

        expect(executeCommandMock).toHaveBeenCalledWith(
            `powershell -Command "& {${searchResultItem.executionServiceArgument}}"`,
        );
    });
});
