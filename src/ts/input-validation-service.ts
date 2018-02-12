import { SearchEngine, SearchResultItem } from "./search-engine";
import { SearchPluginManager } from "./search-plugin-manager";
import { WebUrlExecutor } from "./executors/web-url-executor";
import { Injector } from "./injector";
import { FileBrowser } from "./file-browser";
import { FilePathExecutor } from "./executors/file-path-executor";
import { CommandLineExecutor } from "./executors/command-line-executor";
import { WebSearchExecutor } from "./executors/web-search-executor";

export class InputValidationService {
    private webUrlExecutor: WebUrlExecutor;
    private webSearchExecutor: WebSearchExecutor;
    private filePathExecutor: FilePathExecutor;
    private commandLineExecutor: CommandLineExecutor;
    private searchPluginItems = this.loadSearchPluginItems();

    public constructor() {
        this.webUrlExecutor = new WebUrlExecutor();
        this.webSearchExecutor = new WebSearchExecutor();
        this.filePathExecutor = new FilePathExecutor();
        this.commandLineExecutor = new CommandLineExecutor();
    }

    public getSearchResult(userInput: string): SearchResultItem[] {
        if (this.webUrlExecutor.isValidForExecution(userInput)) {
            return this.handleUrlSearchResult(userInput);
        }
        else if (this.webSearchExecutor.isValidForExecution(userInput)) {
            return this.handleWebSearchSearchResult(userInput);
        }
        else if (this.filePathExecutor.isValidForExecution(userInput)) {
            return this.handleFileBrowserSearchResult(userInput);
        }
        else if (this.commandLineExecutor.isValidForExecution(userInput)) {
            return this.handleCommandLineSearchResult(userInput);
        }
        else {
            return this.handleSearchEngineResult(userInput);
        }
    }

    private handleFileBrowserSearchResult(userInput: string): SearchResultItem[] {
        return new FileBrowser().getSearchResult(userInput);
    }

    private handleUrlSearchResult(userInput: string): SearchResultItem[] {
        return this.webUrlExecutor.getSearchResult(userInput);
    }

    private handleWebSearchSearchResult(userInput: string): SearchResultItem[] {
        return this.webSearchExecutor.getSearchResult(userInput);
    }

    private handleCommandLineSearchResult(userInput: string): SearchResultItem[] {
        return this.commandLineExecutor.getSearchResult(userInput);
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