import type { CommandlineUtility } from "@Core/CommandlineUtility";
import { describe, expect, it, vi } from "vitest";
import { PowershellTerminalLauncher } from "./PowershellTerminalLauncher";

describe(PowershellTerminalLauncher, () => {
    describe(PowershellTerminalLauncher.prototype.terminalId, () =>
        it(`should be "Powershell"`, () => expect(new PowershellTerminalLauncher(null).terminalId).toBe("Powershell")),
    );

    describe(PowershellTerminalLauncher.prototype.launchWithCommand, () => {
        it("should execute the command in a new Powershell window", async () => {
            const commandlineUtility = <CommandlineUtility>{ executeCommand: vi.fn() };
            await new PowershellTerminalLauncher(commandlineUtility).launchWithCommand("ls");
            expect(commandlineUtility.executeCommand).toHaveBeenCalledWith(`start powershell -NoExit -Command "&ls"`);
        });
    });
});
