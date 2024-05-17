import type { AppleScriptUtility } from "@Core/AppleScriptUtility";
import { describe, expect, it, vi } from "vitest";
import { Iterm } from "./Iterm";

describe(Iterm, () => {
    describe(Iterm.prototype.terminalId, () =>
        it(`should be "iTerm"`, () => expect(new Iterm(null).terminalId).toBe("iTerm")),
    );

    describe(Iterm.prototype.launchWithCommand, () => {
        it("should execute the AppleScript to launch iTerm with the given command", async () => {
            const appleScriptUtility = <AppleScriptUtility>{ executeAppleScript: vi.fn() };
            const itermLauncher = new Iterm(appleScriptUtility);

            await itermLauncher.launchWithCommand("ls");

            expect(appleScriptUtility.executeAppleScript).toHaveBeenCalledWith(`tell application "iTerm"
                                                            if not (exists window 1) then
                                                                reopen
                                                            else
                                                                tell current window
                                                                    create tab with default profile
                                                                end tell
                                                            end if

                                                            activate

                                                            tell first session of current tab of current window
                                                                write text "ls"
                                                            end tell
                                                        end tell`);
        });
    });
});
