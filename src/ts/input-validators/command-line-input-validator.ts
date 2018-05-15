import { InputValidator } from "./input-validator";
import { CommandLineHelpers } from "../helpers/command-line-helpers";

export class CommandLineInputValidator implements InputValidator {
    public isValidForSearchResults(userInput: string): boolean {
        return this.userInputStartsWithPrefix(userInput)
            && this.userInputLengthIsMoreThanOnlyPrefix(userInput)
            && this.prefixIsFollowedByCommand(userInput);
    }

    private userInputStartsWithPrefix(userInput: string): boolean {
        return userInput.startsWith(CommandLineHelpers.commandLinePrefix);
    }

    private userInputLengthIsMoreThanOnlyPrefix(userInput: string): boolean {
        return userInput.length > CommandLineHelpers.commandLinePrefix.length;
    }

    private prefixIsFollowedByCommand(userInput: string): boolean {
        return userInput[1] !== " ";
    }
}
