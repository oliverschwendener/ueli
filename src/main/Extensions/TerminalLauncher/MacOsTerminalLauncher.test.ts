import type { AppleScriptUtility } from "@Core/AppleScriptUtility";
import { describe, expect, it, vi } from "vitest";
import { MacOsTerminalLauncher } from "./MacOsTerminalLauncher";

describe(MacOsTerminalLauncher, () => {
    describe(MacOsTerminalLauncher.prototype.terminalId, () =>
        it(`should be "Terminal"`, () => expect(new MacOsTerminalLauncher(null).terminalId).toBe("Terminal")),
    );

    describe(MacOsTerminalLauncher.prototype.launchWithCommand, () => {
        it("should execute the command in a new Terminal window", async () => {
            const appleScriptUtility = <AppleScriptUtility>{ executeAppleScript: vi.fn() };

            await new MacOsTerminalLauncher(appleScriptUtility).launchWithCommand("ls");

            expect(appleScriptUtility.executeAppleScript).toHaveBeenCalledWith(`tell application "Terminal"
                                                            if not (exists window 1) then reopen
                                                                activate
                                                            do script "ls" in window 1
                                                        end tell`);
        });
    });
});
