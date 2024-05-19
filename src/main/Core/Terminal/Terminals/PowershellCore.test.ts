import type { CommandlineUtility } from "@Core/CommandlineUtility";
import { describe, expect, it, vi } from "vitest";
import { PowershellCore } from "./PowershellCore";

describe(PowershellCore, () => {
    describe(PowershellCore.prototype.terminalId, () =>
        it(`should be "Powershell Core"`, () => expect(new PowershellCore(null).terminalId).toBe("Powershell Core")),
    );

    describe(PowershellCore.prototype.launchWithCommand, () => {
        it("should execute the command in a new Powershell Core window", async () => {
            const commandlineUtility = <CommandlineUtility>{ executeCommand: vi.fn() };
            await new PowershellCore(commandlineUtility).launchWithCommand("ls");
            expect(commandlineUtility.executeCommand).toHaveBeenCalledWith(`start pwsh -NoExit -Command "&ls"`);
        });
    });
});
