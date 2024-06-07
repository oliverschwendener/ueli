import type { PowershellUtility } from "@Core/PowershellUtility";
import type { SearchResultItemAction } from "@common/Core";
import { describe, expect, it, vi } from "vitest";
import { OpenAsAdministrator } from "./OpenAsAdministrator";

describe(OpenAsAdministrator, () => {
    describe(OpenAsAdministrator.prototype.id, () =>
        it("should be WindowsOpenAsAdministrator", () =>
            expect(new OpenAsAdministrator(null).id).toBe("WindowsOpenAsAdministrator")),
    );

    describe(OpenAsAdministrator.prototype.invokeAction, () => {
        it("should execute the given command with Start-Process -Verb runas", async () => {
            const powershellUtility = <PowershellUtility>{ executeCommand: vi.fn(), executeScript: vi.fn() };
            const action = <SearchResultItemAction>{ argument: "C:\\path\\to\\file" };

            await new OpenAsAdministrator(powershellUtility).invokeAction(action);

            expect(powershellUtility.executeCommand).toHaveBeenCalledOnce();
            expect(powershellUtility.executeCommand).toHaveBeenCalledWith(
                "Start-Process -Verb runas 'C:\\path\\to\\file'",
            );
        });
    });
});
