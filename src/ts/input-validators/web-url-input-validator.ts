import { InputValidator } from "./input-validator";
import { StringHelpers } from "../helpers/string-helpers";

export class WebUrlInputValidator implements InputValidator {
    public isValidForSearchResults(userInput: string): boolean {
        return StringHelpers.isValidUrl(userInput);
    }
}
