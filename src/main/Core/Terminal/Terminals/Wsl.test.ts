import type { CommandlineUtility } from "@Core/CommandlineUtility";
import { describe, expect, it, vi } from "vitest";
import { Wsl } from "./Wsl";

describe(Wsl, () => {
    describe(Wsl.prototype.terminalId, () =>
        it(`should be "WSL"`, () => expect(new Wsl(<CommandlineUtility>{}).terminalId).toBe("WSL")),
    );

    describe(Wsl.prototype.launchWithCommand, () => {
        it("should execute the command in a new WSL window", async () => {
            const commandlineUtility = <CommandlineUtility>{ executeCommand: vi.fn() };
            await new Wsl(commandlineUtility).launchWithCommand("ls");
            expect(commandlineUtility.executeCommand).toHaveBeenCalledWith(`start wsl.exe sh -c "ls; exec $SHELL"`);
        });
    });
});
