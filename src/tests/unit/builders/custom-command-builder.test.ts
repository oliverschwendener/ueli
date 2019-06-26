import { CustomCommandBuilder } from "../../../ts/builders/custom-command-execution-argument-builder";
import { CustomCommand } from "../../../ts/custom-command";
import { defaultShortcutIcon } from "../test-helpers";

describe(CustomCommandBuilder.name, (): void => {
    const userInput = "ipconfig /all";

    const customCommand: CustomCommand = {
        executionArgument: "!cmd.exe",
        icon: "<svg>...</svg>",
        name: "Open with command prompt",
        prefix: "cmd",
    };

    describe(CustomCommandBuilder.buildExecutionArgumentForCustomCommand.name, (): void => {
        it("should build the execution argument for a custom command correctly", (): void => {
            const actual = CustomCommandBuilder.buildExecutionArgumentForCustomCommand(userInput, customCommand);

            expect(actual).toBe(`${customCommand.executionArgument} ${userInput}`);
        });
    });

    describe(CustomCommandBuilder.buildCustomCommandName.name, (): void => {
        it("should build the search result item name of a custom command correctly", (): void => {
            const actual = CustomCommandBuilder.buildCustomCommandName(userInput, customCommand);
            expect(actual).toBe(`${customCommand.name} ${userInput}`);
        });
    });

    describe(CustomCommandBuilder.buildIcon.name, (): void => {
        it("should return the specified default icon when custom command has no icon set", (): void => {
            const customCommandWithoutIcon: CustomCommand = {
                executionArgument: customCommand.executionArgument,
                icon: "",
                name: customCommand.name,
                prefix: customCommand.prefix,
            };

            const actual = CustomCommandBuilder.buildIcon(defaultShortcutIcon, customCommandWithoutIcon);
            expect(actual).toBe(defaultShortcutIcon);
        });

        it("should return the specified icon when custom command has a icon set", (): void => {
            const actual = CustomCommandBuilder.buildIcon(defaultShortcutIcon, customCommand);
            expect(actual).toBe(customCommand.icon);
        });
    });
});
