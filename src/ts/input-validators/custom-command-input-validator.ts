import { InputValidator } from "./input-validator";
import { CustomCommand } from "../custom-shortcut";
import { StringHelpers } from "../helpers/string-helpers";

export class CustomCommandInputValidator implements InputValidator {
    private customCommands: CustomCommand[];

    constructor(customCommands: CustomCommand[]) {
        this.customCommands = customCommands;
    }

    public isValidForSearchResults(userInput: string): boolean {
        for (const customCommand of this.customCommands) {
            const wordsOfUserInput = StringHelpers.splitIntoWords(userInput);
            if (wordsOfUserInput.length >= 2) {
                const word = wordsOfUserInput[0];
                if (customCommand.prefix.startsWith(word) && !StringHelpers.stringIsWhiteSpace(word)) {
                    return true;
                }
            }
        }

        return false;
    }
}
