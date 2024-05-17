import type { CommandlineUtility } from "@Core/CommandlineUtility";
import { describe, expect, it, vi } from "vitest";
import { PowershellCoreTerminalLauncher } from "./PowershellCoreTerminalLauncher";

describe(PowershellCoreTerminalLauncher, () => {
    describe(PowershellCoreTerminalLauncher.prototype.terminalId, () =>
        it(`should be "Powershell Core"`, () =>
            expect(new PowershellCoreTerminalLauncher(null).terminalId).toBe("Powershell Core")),
    );

    describe(PowershellCoreTerminalLauncher.prototype.launchWithCommand, () => {
        it("should execute the command in a new Powershell Core window", async () => {
            const commandlineUtility = <CommandlineUtility>{ executeCommand: vi.fn() };
            await new PowershellCoreTerminalLauncher(commandlineUtility).launchWithCommand("ls");
            expect(commandlineUtility.executeCommand).toHaveBeenCalledWith(`start pwsh -NoExit -Command "&ls"`);
        });
    });
});
