import type { PowershellUtility } from "@Core/PowershellUtility";
import type { SearchResultItemAction } from "@common/SearchResultItemAction";
import { describe, expect, it, vi } from "vitest";
import { PowershellActionHandler } from "./PowershellActionHandler";

describe(PowershellActionHandler, () => {
    it("should execute powershell commands", () => {
        const executeCommandMock = vi.fn();

        const powershellUtility = <PowershellUtility>{
            executeCommand: (command) => executeCommandMock(command),
        };

        const action = <SearchResultItemAction>{
            argument: "this is my powershell command",
        };

        new PowershellActionHandler(powershellUtility).invokeAction(action);

        expect(executeCommandMock).toHaveBeenCalledWith(`powershell -Command "& {${action.argument}}"`);
    });
});
