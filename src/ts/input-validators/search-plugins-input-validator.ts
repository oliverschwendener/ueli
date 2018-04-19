import { StringHelpers } from "../helpers/string-helpers";
import { InputValidator } from "./input-validator";
import { Config } from "../config";

export class SearchPluginsInputValidator implements InputValidator {
    public isValidForSearchResults(userInput: string): boolean {
        return StringHelpers.trimAndReplaceMultipleWhiteSpacesWithOne(userInput).length > 0
            && !userInput.startsWith(Config.commandLinePrefix);
    }
}
