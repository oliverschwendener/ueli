import { StringHelpers } from "./helpers/string-helpers";
import { CommandLineInputValidator } from "./input-validators/command-line-input-validator";
import { FilePathInputValidator } from "./input-validators/file-path-input-validator";
import { SearchPluginsInputValidator } from "./input-validators/search-plugins-input-validator";
import { WebSearchInputValidator } from "./input-validators/web-search-input-validator";
import { WebUrlInputValidator } from "./input-validators/web-url-input-validator";
import { SearchResultItem } from "./search-result-item";
import { CommandLineSearcher } from "./searcher/command-line-searcher";
import { FilePathSearcher } from "./searcher/file-path-searcher";
import { WebSearchSearcher } from "./searcher/web-search-searcher";
import { WebUrlSearcher } from "./searcher/web-url-searcher";
import { InputValidatorSearcherCombination } from "./input-validator-searcher-combination";
import { EmailAddressSearcher } from "./searcher/email-address-searcher";
import { EmailAddressInputValidator } from "./input-validators/email-address-input-validator";
import { CalculatorInputValidator } from "./input-validators/calculator-input-validator";
import { CalculatorSearcher } from "./searcher/calculator-searcher";
import { FallbackWebSearchSercher } from "./searcher/fallback-web-search-searcher";
import { ConfigOptions } from "./config-options";

export class InputValidationService {
    private configOptions: ConfigOptions;
    private validatorSearcherCombinations: InputValidatorSearcherCombination[];

    public constructor(configOptions: ConfigOptions, validatorSearcherCombinations: InputValidatorSearcherCombination[]) {
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
                result = result.concat(combination.searcher.getSearchResult(trimmedUserInput));
            }
        }

        if (result.length === 0 && this.configOptions.fallbackWebSearches.length > 0) {
            result = new FallbackWebSearchSercher(this.configOptions.fallbackWebSearches, this.configOptions.webSearches).getSearchResult(userInput);
        }

        return result;
    }
}
