import { StringHelpers } from "./helpers/string-helpers";
import { SearchResultItem } from "./search-result-item";
import { InputValidatorSearcherCombination } from "./input-validator-searcher-combination";
import { FallbackWebSearchSercher } from "./searcher/fallback-web-search-searcher";
import { UserConfigOptions } from "./user-config/user-config-options";

export class InputValidationService {
    private readonly configOptions: UserConfigOptions;
    private readonly validatorSearcherCombinations: InputValidatorSearcherCombination[];

    public constructor(configOptions: UserConfigOptions, validatorSearcherCombinations: InputValidatorSearcherCombination[]) {
        this.configOptions = configOptions;
        this.validatorSearcherCombinations = validatorSearcherCombinations;
    }

    public getSearchResult(userInput: string): SearchResultItem[] {
        let result = [] as SearchResultItem[];

        if (userInput === undefined || userInput === null || StringHelpers.stringIsWhiteSpace(userInput)) {
            return result;
        }

        const trimmedUserInput = StringHelpers.trimAndReplaceMultipleWhiteSpacesWithOne(userInput);

        for (const combination of this.validatorSearcherCombinations) {
            if (combination.validator.isValidForSearchResults(trimmedUserInput)) {
                if (combination.searcher.blockOthers) {
                    result = combination.searcher.getSearchResult(trimmedUserInput);
                    break;
                } else {
                    result = result.concat(combination.searcher.getSearchResult(trimmedUserInput));
                }
            }
        }

        if (result.length === 0 && this.configOptions.fallbackWebSearches.length > 0) {
            const fallBackWebSearchSearcher = new FallbackWebSearchSercher(this.configOptions.fallbackWebSearches, this.configOptions.webSearches);
            result = fallBackWebSearchSearcher.getSearchResult(userInput);
        }

        return result;
    }
}
