import { PowershellUtility } from "@Core/PowershellUtility/Contract";
import { SearchResultItemAction } from "@common/Core";
import { describe, expect, it, vi } from "vitest";
import { WindowsControlPanelActionHandler } from "./WindowsControlPanelActionHandler";

describe(WindowsControlPanelActionHandler, () => {
    describe(WindowsControlPanelActionHandler.prototype.invokeAction, () => {
        it("should invoke powershell command", async () => {
            const powershellUtility = <PowershellUtility>{
                executeCommand: vi.fn().mockResolvedValue(""),
                executeScript: vi.fn().mockResolvedValue(""),
            };
            const handler = new WindowsControlPanelActionHandler(powershellUtility);
            const action: SearchResultItemAction = {
                argument: "arg",
                description: "desc",
                handlerId: "handlerId",
            };

            await handler.invokeAction(action);

            expect(powershellUtility.executeCommand).toHaveBeenCalledWith("Show-ControlPanelItem -Name 'arg'");
        });
    });
});
