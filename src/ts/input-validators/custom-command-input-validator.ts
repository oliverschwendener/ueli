import { InputValidator } from "./input-validator";
import { CustomCommand } from "../custom-shortcut";

export class CustomCommandInputValidator implements InputValidator {
    private customCommands: CustomCommand[];

    constructor(customCommands: CustomCommand[]) {
        this.customCommands = customCommands;
    }

    public isValidForSearchResults(userInput: string): boolean {
        for (const customCommand of this.customCommands) {
            if (userInput.startsWith(customCommand.prefix) && userInput.length > customCommand.prefix.length) {
                return true;
            }
        }

        return false;
    }
}
