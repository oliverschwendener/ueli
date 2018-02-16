import { SearchEngine, SearchResultItem } from "./search-engine";
import { SearchPluginManager } from "./search-plugin-manager";
import { WebUrlExecutor } from "./executors/web-url-executor";
import { Injector } from "./injector";
import { FilePathExecutor } from "./executors/file-path-executor";
import { CommandLineExecutor } from "./executors/command-line-executor";
import { WebSearchExecutor } from "./executors/web-search-executor";
import { InputValidator } from "./input-validators/input-validator";
import { Searcher } from "./searcher/searcher";
import { FilePathInputValidator } from "./input-validators/file-path-input-validator";
import { FilePathSearcher } from "./searcher/file-path-searcher";
import { CommandLineInputValidator } from "./input-validators/command-line-input-validator";
import { CommandLineSearcher } from "./searcher/command-line-searcher";
import { WebSearchInputValidator } from "./input-validators/web-search-input-validator";
import { WebSearchSearcher } from "./searcher/web-search-searcher";
import { WebUrlInputValidator } from "./input-validators/web-url-input-validator";
import { WebUrlSearcher } from "./searcher/web-url-searcher";
import { StringHelpers } from "./helpers/string-helpers";
import { SearchPluginsInputValidator } from "./input-validators/search-plugins-input-validator";
import { SearchPluginsSearcher } from "./searcher/search-plugins-searcher";

export class InputValidationService {
    private validatorSearcherCombinations = [
        <ValidatorSearcherCombination>{
            validator: new FilePathInputValidator(),
            searcher: new FilePathSearcher()
        },
        <ValidatorSearcherCombination>{
            validator: new CommandLineInputValidator(),
            searcher: new CommandLineSearcher()
        },
        <ValidatorSearcherCombination>{
            validator: new WebSearchInputValidator(),
            searcher: new WebSearchSearcher()
        },
        <ValidatorSearcherCombination>{
            validator: new WebUrlInputValidator(),
            searcher: new WebUrlSearcher()
        },
        <ValidatorSearcherCombination>{
            validator: new SearchPluginsInputValidator(),
            searcher: new SearchPluginsSearcher()
        }
    ];

    public getSearchResult(userInput: string): SearchResultItem[] {
        userInput = StringHelpers.trimAndReplaceMultipleWhiteSpacesWithOne(userInput);

        if (StringHelpers.stringIsWhiteSpace(userInput)) {
            return [];
        }

        for (let combi of this.validatorSearcherCombinations) {
            if (combi.validator.isValidForSearchResults(userInput)) {
                return combi.searcher.getSearchResult(userInput);
            }
        }

        throw new Error(`No search results found for ${userInput}`);
    }
}

class ValidatorSearcherCombination {
    public validator: InputValidator;
    public searcher: Searcher;
}