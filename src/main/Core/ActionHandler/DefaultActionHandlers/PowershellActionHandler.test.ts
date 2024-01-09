import type { SearchResultItemAction } from "@common/SearchResultItemAction";
import { describe, expect, it, vi } from "vitest";
import type { CommandlineUtility } from "../../CommandlineUtility";
import { PowershellActionHandler } from "./PowershellActionHandler";

describe(PowershellActionHandler, () => {
    it("should execute powershell commands", () => {
        const executeCommandMock = vi.fn();

        const commandlineUtility = <CommandlineUtility>{
            executeCommand: (command) => executeCommandMock(command),
        };

        const action = <SearchResultItemAction>{
            argument: "this is my powershell command",
        };

        new PowershellActionHandler(commandlineUtility).invokeAction(action);

        expect(executeCommandMock).toHaveBeenCalledWith(`powershell -Command "& {${action.argument}}"`);
    });
});
