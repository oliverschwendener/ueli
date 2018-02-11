import { SearchEngine, SearchResultItem } from "./search-engine";
import { SearchPluginManager } from "./search-plugin-manager";
import { WebUrlExecutor } from "./executors/web-url-executor";
import { Executor } from "./executors/executor";
import { Injector } from "./injector";
import { FileBrowser } from "./file-browser";
import { FilePathExecutor } from "./executors/file-path-executor";

export class InputValidationService {
    private webUrlExecutor: WebUrlExecutor;
    private filePathExecutor: Executor;
    private searchPluginItems = this.loadSearchPluginItems();

    constructor() {
        this.webUrlExecutor = new WebUrlExecutor();
        this.filePathExecutor = new FilePathExecutor();
    }

    public getSearchResult(userInput: string): SearchResultItem[] {
        if (this.webUrlExecutor.isValidForExecution(userInput)) {
            return this.handleUrlSearchResult(userInput);
        }
        if (this.filePathExecutor.isValidForExecution(userInput)) {
            return this.handleFileBrowserSearchResult(userInput);
        }
        else {
            return this.handleSearchEngineResult(userInput);
        }
    }

    private handleFileBrowserSearchResult(userInput: string): SearchResultItem[] {
        let fileBrowser = new FileBrowser();
        return fileBrowser.getSearchResult(userInput);
    }

    private handleUrlSearchResult(userInput): SearchResultItem[] {
        return this.webUrlExecutor.getSearchResult(userInput);
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