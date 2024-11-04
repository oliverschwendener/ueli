import type { CommandlineUtility } from "@Core/CommandlineUtility";
import { describe, expect, it, vi } from "vitest";
import { CommandPrompt } from "./CommandPrompt";

describe(CommandPrompt, () => {
    describe(CommandPrompt.prototype.terminalId, () =>
        it(`should return "Command Prompt"`, () =>
            expect(new CommandPrompt(<CommandlineUtility>{}).terminalId).toBe("Command Prompt")),
    );

    describe(CommandPrompt.prototype.launchWithCommand, () => {
        it("should execute the command in a new Command Prompt window", async () => {
            const commandlineUtility = <CommandlineUtility>{ executeCommand: vi.fn() };
            await new CommandPrompt(commandlineUtility).launchWithCommand("echo Hello");
            expect(commandlineUtility.executeCommand).toHaveBeenCalledWith(`start cmd.exe /k "echo Hello"`);
        });
    });
});
