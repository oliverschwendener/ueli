import { InputValidator } from "./input-validator";

export class SearchEngineInputValidator implements InputValidator {
    public isValidForSearchResults(userInput: string): boolean {
        return userInput.length > 0;
    }
}