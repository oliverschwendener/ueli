import { StringHelpers } from "../helpers/string-helpers";
import { InputValidator } from "./input-validator";

export class SearchPluginsInputValidator implements InputValidator {
    public isValidForSearchResults(userInput: string): boolean {
        return StringHelpers.trimAndReplaceMultipleWhiteSpacesWithOne(userInput).length > 0;
    }
}
