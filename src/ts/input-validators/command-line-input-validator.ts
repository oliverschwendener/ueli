import { InputValidator } from "./input-validator";
import { Config } from "../config";

export class CommandLineInputValidator implements InputValidator {
    public isValidForSearchResults(userInput: string): boolean {
        return userInput.startsWith(Config.commandLinePrefix)
            && userInput.length > Config.commandLinePrefix.length;
    }
}