import type { SearchResultItemAction } from "@common/Core";
import { describe, expect, it, vi } from "vitest";
import type { ActionArgument } from "./ActionArgument";
import { LaunchTerminalActionHandler } from "./LaunchTerminalActionHandler";

describe(LaunchTerminalActionHandler, () => {
    describe(LaunchTerminalActionHandler.prototype.id, () =>
        it(`should be "LaunchTerminalActionHandler"`, () =>
            expect(new LaunchTerminalActionHandler([]).id).toBe("LaunchTerminalActionHandler")),
    );

    describe(LaunchTerminalActionHandler.prototype.invokeAction, () => {
        it("should find the terminal launcher by terminalId and launch the command", async () => {
            const terminalLauncher = { terminalId: "iTerm", launchWithCommand: vi.fn() };

            await new LaunchTerminalActionHandler([terminalLauncher]).invokeAction(<SearchResultItemAction>{
                argument: JSON.stringify(<ActionArgument>{
                    command: "ls",
                    terminalId: "iTerm",
                }),
            });

            expect(terminalLauncher.launchWithCommand).toHaveBeenCalledWith("ls");
        });

        it("should throw an error if terminal launcher is not found", () => {
            const action = <SearchResultItemAction>{
                argument: JSON.stringify(<ActionArgument>{
                    command: "ls",
                    terminalId: "iTerm",
                }),
            };

            const actionHandler = new LaunchTerminalActionHandler([]);

            expect(async () => await actionHandler.invokeAction(action)).rejects.toThrow(
                "Unable to launch terminal with id  iTerm. Reason: no launcher found",
            );
        });
    });
});
