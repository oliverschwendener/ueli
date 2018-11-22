import { Searcher } from "./searcher";
import { SearchResultItem } from "../search-result-item";
import { CustomCommand } from "../custom-shortcut";
import { CustomCommandBuilder } from "../builders/custom-command-execution-argument-builder";
import { UeliHelpers } from "../helpers/ueli-helpers";
import { StringHelpers } from "../helpers/string-helpers";

export class CustomCommandSearcher implements Searcher {
    public readonly blockOthers = false;

    private readonly customCommands: CustomCommand[];
    private readonly defaultIcon: string;

    constructor(customCommands: CustomCommand[], defaultIcon: string) {
        this.customCommands = customCommands;
        this.defaultIcon = defaultIcon;
    }

    public getSearchResult(userInput: string): SearchResultItem[] {
        const result: SearchResultItem[] = [];
        const firstWord = StringHelpers.splitIntoWords(userInput)[0];

        for (const customCommand of this.customCommands) {
            if (userInput.startsWith(customCommand.prefix) || (firstWord.length > 0 && customCommand.prefix.startsWith(firstWord))) {
                result.push({
                    description: UeliHelpers.customCommandDescription,
                    executionArgument: CustomCommandBuilder.buildExecutionArgumentForCustomCommand(userInput, customCommand),
                    icon: CustomCommandBuilder.buildIcon(this.defaultIcon, customCommand),
                    name: CustomCommandBuilder.buildCustomCommandName(userInput, customCommand),
                    searchable: [],
                });
            }
        }

        return result;
    }
}
