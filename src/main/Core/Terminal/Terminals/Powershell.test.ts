import type { CommandlineUtility } from "@Core/CommandlineUtility";
import { describe, expect, it, vi } from "vitest";
import { Powershell } from "./Powershell";

describe(Powershell, () => {
    describe(Powershell.prototype.terminalId, () =>
        it(`should be "Powershell"`, () =>
            expect(new Powershell(<CommandlineUtility>{}).terminalId).toBe("Powershell")),
    );

    describe(Powershell.prototype.launchWithCommand, () => {
        it("should execute the command in a new Powershell window", async () => {
            const commandlineUtility = <CommandlineUtility>{ executeCommand: vi.fn() };
            await new Powershell(commandlineUtility).launchWithCommand("ls");
            expect(commandlineUtility.executeCommand).toHaveBeenCalledWith(`start powershell -NoExit -Command "&ls"`);
        });
    });
});
