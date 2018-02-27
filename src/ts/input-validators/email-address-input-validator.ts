import { InputValidator } from "./input-validator";
import { Injector } from "../injector";
import { StringHelpers } from "../helpers/string-helpers";

export class EmailAddressInputValidator implements InputValidator {
    public isValidForSearchResults(userInput: string): boolean {
        return StringHelpers.isValidEmailAddress(userInput);
    }
}
