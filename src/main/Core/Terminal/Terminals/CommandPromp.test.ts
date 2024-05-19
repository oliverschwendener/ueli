import type { CommandlineUtility } from "@Core/CommandlineUtility";
import { describe, expect, it, vi } from "vitest";
import { CommandPromp } from "./CommandPromp";

describe(CommandPromp, () => {
    describe(CommandPromp.prototype.terminalId, () =>
        it(`should return "Command Prompt"`, () => expect(new CommandPromp(null).terminalId).toBe("Command Prompt")),
    );

    describe(CommandPromp.prototype.launchWithCommand, () => {
        it("should execute the command in a new Command Prompt window", async () => {
            const commandlineUtility = <CommandlineUtility>{ executeCommand: vi.fn() };
            await new CommandPromp(commandlineUtility).launchWithCommand("echo Hello");
            expect(commandlineUtility.executeCommand).toHaveBeenCalledWith(`start cmd.exe /k "echo Hello"`);
        });
    });
});
