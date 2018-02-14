import { SearchEngine, SearchResultItem } from "./search-engine";
import { SearchPluginManager } from "./search-plugin-manager";
import { WebUrlExecutor } from "./executors/web-url-executor";
import { Injector } from "./injector";
import { FilePathExecutor } from "./executors/file-path-executor";
import { CommandLineExecutor } from "./executors/command-line-executor";
import { WebSearchExecutor } from "./executors/web-search-executor";
import { InputValidator } from "./input-validators.ts/input-validator";
import { Searcher } from "./searcher/searcher";
import { FilePathInputValidator } from "./input-validators.ts/file-path-input-validator";
import { FilePathSearcher } from "./searcher/file-path-searcher";
import { CommandLineInputValidator } from "./input-validators.ts/command-line-input-validator";
import { CommandLineSearcher } from "./searcher/command-line-searcher";
import { WebSearchInputValidator } from "./input-validators.ts/web-search-input-validator";
import { WebSearchSearcher } from "./searcher/web-search-searcher";
import { WebUrlInputValidator } from "./input-validators.ts/web-url-input-validator";
import { WebUrlSearcher } from "./searcher/web-url-searcher";

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
        }
    ];

    private searchPluginItems = this.loadSearchPluginItems();

    public getSearchResult(userInput: string): SearchResultItem[] {
        for (let combi of this.validatorSearcherCombinations) {
            if (combi.validator.isValidForSearchResults(userInput)) {
                return combi.searcher.getSearchResult(userInput);
            }
        }

        return this.handleSearchEngineResult(userInput);
    }

    private handleSearchEngineResult(userInput: string): SearchResultItem[] {
        let searchEngine = new SearchEngine(this.searchPluginItems);
        return searchEngine.search(userInput);
    }

    private loadSearchPluginItems(): SearchResultItem[] {
        let result = [] as SearchResultItem[];

        let plugins = new SearchPluginManager().getPlugins();

        for (let plugin of plugins) {
            result = result.concat(plugin.getAllItems());
        }

        return result;
    }
}

class ValidatorSearcherCombination {
    public validator: InputValidator;
    public searcher: Searcher;
}