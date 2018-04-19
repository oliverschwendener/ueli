import { StringHelpers } from "./helpers/string-helpers";
import { CommandLineInputValidator } from "./input-validators/command-line-input-validator";
import { FilePathInputValidator } from "./input-validators/file-path-input-validator";
import { SearchPluginsInputValidator } from "./input-validators/search-plugins-input-validator";
import { WebSearchInputValidator } from "./input-validators/web-search-input-validator";
import { WebUrlInputValidator } from "./input-validators/web-url-input-validator";
import { SearchResultItem } from "./search-result-item";
import { CommandLineSearcher } from "./searcher/command-line-searcher";
import { FilePathSearcher } from "./searcher/file-path-searcher";
import { SearchPluginsSearcher } from "./searcher/search-plugins-searcher";
import { WebSearchSearcher } from "./searcher/web-search-searcher";
import { WebUrlSearcher } from "./searcher/web-url-searcher";
import { InputValidatorSearcherCombination } from "./input-validator-searcher-combination";
import { EmailAddressSearcher } from "./searcher/email-address-searcher";
import { EmailAddressInputValidator } from "./input-validators/email-address-input-validator";

export class InputValidationService {
    private validatorSearcherCombinations = [
        {
            searcher: new FilePathSearcher(),
            validator: new FilePathInputValidator(),
        },
        {
            searcher: new CommandLineSearcher(),
            validator: new CommandLineInputValidator(),
        },
        {
            searcher: new WebSearchSearcher(),
            validator: new WebSearchInputValidator(),
        },
        {
            searcher: new EmailAddressSearcher(),
            validator: new EmailAddressInputValidator(),
        },
        {
            searcher: new WebUrlSearcher(),
            validator: new WebUrlInputValidator(),
        },
        {
            searcher: new SearchPluginsSearcher(),
            validator: new SearchPluginsInputValidator(),
        },
    ] as InputValidatorSearcherCombination[];

    public getSearchResult(userInput: string): SearchResultItem[] {
        userInput = StringHelpers.trimAndReplaceMultipleWhiteSpacesWithOne(userInput);

        if (StringHelpers.stringIsWhiteSpace(userInput)) {
            return [];
        }

        for (const combination of this.validatorSearcherCombinations) {
            if (combination.validator.isValidForSearchResults(userInput)) {
                return combination.searcher.getSearchResult(userInput);
            }
        }

        return [];
    }
}
