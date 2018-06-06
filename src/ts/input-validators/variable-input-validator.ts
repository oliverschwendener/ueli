import { Injector } from "../injector";
import { InputValidator } from "./input-validator";
import { platform } from "os";

export class VariableInputValidator implements InputValidator {
    public readonly variablePrefix = "$";
    public isValidForSearchResults(userInput: string): boolean {
        return userInput.startsWith(this.variablePrefix);
    }
}
