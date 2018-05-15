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

export class InputValidationService {
    private validatorSearcherCombinations: InputValidatorSearcherCombination[];

    public constructor(validatorSearcherCombinations: InputValidatorSearcherCombination[]) {
        this.validatorSearcherCombinations = validatorSearcherCombinations;
    }

    public getSearchResult(userInput: string): SearchResultItem[] {
        let result = [] as SearchResultItem[];
        userInput = StringHelpers.trimAndReplaceMultipleWhiteSpacesWithOne(userInput);

        if (StringHelpers.stringIsWhiteSpace(userInput)) {
            return result;
        }

        for (const combination of this.validatorSearcherCombinations) {
            if (combination.validator.isValidForSearchResults(userInput)) {
                result = result.concat(combination.searcher.getSearchResult(userInput));
            }
        }

        return result;
    }
}
