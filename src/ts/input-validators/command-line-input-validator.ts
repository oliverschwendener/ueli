import { Config } from "../config";
import { InputValidator } from "./input-validator";

export class CommandLineInputValidator implements InputValidator {
    public isValidForSearchResults(userInput: string): boolean {
        return this.userInputStartsWithPrefix(userInput)
            && this.userInputLengthIsMoreThanOnlyPrefix(userInput)
            && this.prefixIsFollowedByCommand(userInput);
    }

    private userInputStartsWithPrefix(userInput: string): boolean {
        return userInput.startsWith(Config.commandLinePrefix);
    }

    private userInputLengthIsMoreThanOnlyPrefix(userInput: string): boolean {
        return userInput.length > Config.commandLinePrefix.length;
    }

    private prefixIsFollowedByCommand(userInput: string): boolean {
        return userInput[1] !== " ";
    }
}
