import type { CommandlineUtility } from "@Core/CommandlineUtility";
import { describe, expect, it, vi } from "vitest";
import { CommandPrompLauncher } from "./CommandPromptLauncher";

describe(CommandPrompLauncher, () => {
    describe(CommandPrompLauncher.prototype.terminalId, () =>
        it(`should return "Command Prompt"`, () =>
            expect(new CommandPrompLauncher(null).terminalId).toBe("Command Prompt")),
    );

    describe(CommandPrompLauncher.prototype.launchWithCommand, () => {
        it("should execute the command in a new Command Prompt window", async () => {
            const commandlineUtility = <CommandlineUtility>{ executeCommand: vi.fn() };
            await new CommandPrompLauncher(commandlineUtility).launchWithCommand("echo Hello");
            expect(commandlineUtility.executeCommand).toHaveBeenCalledWith(`start cmd.exe /k "echo Hello"`);
        });
    });
});
