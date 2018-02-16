import { InputValidator } from "./input-validator";
import { StringHelpers } from "../helpers/string-helpers";

export class SearchPluginsInputValidator implements InputValidator {
    public isValidForSearchResults(userInput: string): boolean {
        return StringHelpers.trimAndReplaceMultipleWhiteSpacesWithOne(userInput).length > 0;
    }
}