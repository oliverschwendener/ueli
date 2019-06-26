import { StringHelpers } from "../helpers/string-helpers";
import { CustomCommand } from "../custom-command";

export class CustomCommandBuilder {
    public static buildExecutionArgumentForCustomCommand(userInput: string, customCommand: CustomCommand): string {
        const words = StringHelpers.splitIntoWords(userInput);
        return `${customCommand.executionArgument} ${words.filter((word): boolean => word !== customCommand.prefix).join(" ")}`;
    }

    public static buildCustomCommandName(userInput: string, customCommand: CustomCommand): string {
        return `${customCommand.name} ${StringHelpers.splitIntoWords(userInput).filter((word) => word !== customCommand.prefix).join(" ")}`;
    }

    public static buildIcon(defaultIcon: string, customCommand: CustomCommand): string {
        return customCommand.icon === undefined || customCommand.icon.length === 0
            ? defaultIcon
            : customCommand.icon;
    }
}
