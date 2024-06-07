import type { Terminal, TerminalRegistry } from "@Core/Terminal";
import type { SearchResultItemAction } from "@common/Core";
import { describe, expect, it, vi } from "vitest";
import type { ActionArgument } from "./ActionArgument";
import { LaunchTerminalActionHandler } from "./LaunchTerminalActionHandler";

describe(LaunchTerminalActionHandler, () => {
    describe(LaunchTerminalActionHandler.prototype.id, () =>
        it(`should be "LaunchTerminalActionHandler"`, () =>
            expect(new LaunchTerminalActionHandler(null).id).toBe("LaunchTerminalActionHandler")),
    );

    describe(LaunchTerminalActionHandler.prototype.invokeAction, () => {
        it("should find the terminal launcher by terminalId and launch the command", async () => {
            const terminal = <Terminal>{
                terminalId: "iTerm",
                getAssetFileName: vi.fn(),
                getTerminalName: vi.fn(),
                launchWithCommand: vi.fn(),
            };

            const terminalRegistry = <TerminalRegistry>{
                getById: vi.fn().mockReturnValue(terminal),
                getAll: vi.fn(),
            };

            await new LaunchTerminalActionHandler(terminalRegistry).invokeAction(<SearchResultItemAction>{
                argument: JSON.stringify(<ActionArgument>{
                    command: "ls",
                    terminalId: "iTerm",
                }),
            });

            expect(terminal.launchWithCommand).toHaveBeenCalledWith("ls");
        });
    });
});
