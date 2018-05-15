import { StringHelpers } from "../helpers/string-helpers";
import { InputValidator } from "./input-validator";
import { CommandLineHelpers } from "../helpers/command-line-helpers";

export class SearchPluginsInputValidator implements InputValidator {
    public isValidForSearchResults(userInput: string): boolean {
        return StringHelpers.trimAndReplaceMultipleWhiteSpacesWithOne(userInput).length > 0
            && !userInput.startsWith(CommandLineHelpers.commandLinePrefix);
    }
}
