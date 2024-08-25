import type { PowershellUtility } from "@Core/PowershellUtility";
import type { SearchResultItemAction } from "@common/Core";
import { describe, expect, it, vi } from "vitest";
import { PowershellActionHandler } from "./PowershellActionHandler";

describe(PowershellActionHandler, () => {
    it("should execute powershell commands", async () => {
        const executeCommandMock = vi.fn();
        const powershellUtility = <PowershellUtility>{ executeCommand: (command) => executeCommandMock(command) };

        const actionHandler = new PowershellActionHandler(powershellUtility);
        await actionHandler.invokeAction(<SearchResultItemAction>{ argument: "ps command" });

        expect(executeCommandMock).toHaveBeenCalledWith(`powershell -Command "& {ps command}"`);
    });
});
