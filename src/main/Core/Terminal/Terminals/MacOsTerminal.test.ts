import type { AppleScriptUtility } from "@Core/AppleScriptUtility";
import { describe, expect, it, vi } from "vitest";
import { MacOsTerminal } from "./MacOsTerminal";

describe(MacOsTerminal, () => {
    describe(MacOsTerminal.prototype.terminalId, () =>
        it(`should be "Terminal"`, () => expect(new MacOsTerminal(null).terminalId).toBe("Terminal")),
    );

    describe(MacOsTerminal.prototype.launchWithCommand, () => {
        it("should execute the command in a new Terminal window", async () => {
            const appleScriptUtility = <AppleScriptUtility>{ executeAppleScript: vi.fn() };

            await new MacOsTerminal(appleScriptUtility).launchWithCommand("ls");

            expect(appleScriptUtility.executeAppleScript).toHaveBeenCalledWith(`tell application "Terminal"
                                                            if not (exists window 1) then reopen
                                                                activate
                                                            do script "ls" in window 1
                                                        end tell`);
        });
    });
});
