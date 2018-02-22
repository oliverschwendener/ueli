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
import { ValidatorSearcherCombination } from "./validator-searcher-combination";

export class InputValidationService {
    private validatorSearcherCombinations = [
        {
            searcher: new FilePathSearcher(),
            validator: new FilePathInputValidator(),
        } as ValidatorSearcherCombination,
        {
            searcher: new CommandLineSearcher(),
            validator: new CommandLineInputValidator(),
        } as ValidatorSearcherCombination,
        {
            searcher: new WebSearchSearcher(),
            validator: new WebSearchInputValidator(),
        } as ValidatorSearcherCombination,
        {
            searcher: new WebUrlSearcher(),
            validator: new WebUrlInputValidator(),
        } as ValidatorSearcherCombination,
        {
            searcher: new SearchPluginsSearcher(),
            validator: new SearchPluginsInputValidator(),
        } as ValidatorSearcherCombination,
    ];

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

        throw new Error(`No search results found for ${userInput}`);
    }
}
