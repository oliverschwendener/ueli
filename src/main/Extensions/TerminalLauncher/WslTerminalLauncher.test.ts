import type { CommandlineUtility } from "@Core/CommandlineUtility";
import { describe, expect, it, vi } from "vitest";
import { WslTerminalLauncher } from "./WslTerminalLauncher";

describe(WslTerminalLauncher, () => {
    describe(WslTerminalLauncher.prototype.terminalId, () =>
        it(`should be "WSL"`, () => expect(new WslTerminalLauncher(null).terminalId).toBe("WSL")),
    );

    describe(WslTerminalLauncher.prototype.launchWithCommand, () => {
        it("should execute the command in a new WSL window", async () => {
            const commandlineUtility = <CommandlineUtility>{ executeCommand: vi.fn() };
            await new WslTerminalLauncher(commandlineUtility).launchWithCommand("ls");
            expect(commandlineUtility.executeCommand).toHaveBeenCalledWith(`start wsl.exe sh -c "ls; exec $SHELL"`);
        });
    });
});
