import { Config } from "../config";
import { InputValidator } from "./input-validator";

export class CommandLineInputValidator implements InputValidator {
    public isValidForSearchResults(userInput: string): boolean {
        return userInput.startsWith(Config.commandLinePrefix)
            && userInput.length > Config.commandLinePrefix.length;
    }
}
