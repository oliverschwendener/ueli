import { SearchResultItem } from "../../../common/search-result-item";
import { PluginType } from "../../plugin-type";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { WebSearchOptions } from "../../../common/config/websearch-options";
import { ExecutionPlugin } from "../../execution-plugin";
import { WebSearchEngine } from "./web-search-engine";

export class WebSearchPlugin implements ExecutionPlugin {
    public readonly pluginType = PluginType.WebSearchPlugin;
    public readonly openLocationSupported = false;
    private config: WebSearchOptions;
    private readonly urlExecutor: (url: string) => Promise<void>;

    constructor(userConfig: UserConfigOptions, urlExecutor: (url: string) => Promise<void>) {
        this.config = userConfig.websearchOptions;
        this.urlExecutor = urlExecutor;
    }

    public getSearchResults(userInput: string, fallback?: boolean): Promise<SearchResultItem[]> {
        return new Promise((resolve, reject) => {
            const searchResults = this.config.webSearchEngines
                .filter((webSearchEngine) => {
                    return fallback
                        ? webSearchEngine.isFallback
                        : userInput.startsWith(webSearchEngine.prefix);
                })
                .sort((a, b) => {
                    if (a.priority > b.priority) {
                        return 1;
                    }
                    if (a.priority < b.priority) {
                        return -1;
                    }
                    return 0;
                })
                .map((webSearchEngine): SearchResultItem => {
                    return {
                        description: this.buildDescription(webSearchEngine, userInput),
                        executionArgument: this.buildExecutionArgument(webSearchEngine, userInput),
                        hideMainWindowAfterExecution: true,
                        icon: webSearchEngine.icon,
                        name: webSearchEngine.name,
                        originPluginType: this.pluginType,
                        searchable: [],
                    };
                });

            resolve(searchResults);
        });
    }

    public isValidUserInput(userInput: string, fallback?: boolean): boolean {
        return userInput !== undefined
            && userInput.length > 0
            && this.userInputMatches(userInput, fallback);
    }

    public execute(searchResultItem: SearchResultItem): Promise<void> {
        return this.urlExecutor(searchResultItem.executionArgument);
    }

    public isEnabled() {
        return this.config.isEnabled;
    }

    public openLocation(): Promise<void> {
        throw new Error("not implemented");
    }

    public updateConfig(updatedConfig: UserConfigOptions): Promise<void> {
        return new Promise((resolve) => {
            this.config = updatedConfig.websearchOptions;
            resolve();
        });
    }

    private getSearchTerm(webSearchEngine: WebSearchEngine, userInput: string): string {
        return userInput.replace(webSearchEngine.prefix, "");
    }

    private buildDescription(webSearchEngine: WebSearchEngine, userInput: string): string {
        return `Search on ${webSearchEngine.name} for "${this.getSearchTerm(webSearchEngine, userInput)}"`;
    }

    private buildExecutionArgument(webSearchEngine: WebSearchEngine, userInput: string): string {
        return webSearchEngine.url.replace("{{query}}", this.getSearchTerm(webSearchEngine, userInput));
    }

    private userInputMatches(userInput: string, fallback?: boolean): boolean {
        return this.config.webSearchEngines.some((websearchEngine) => {
            return fallback
                ? websearchEngine.isFallback
                : userInput.startsWith(websearchEngine.prefix);
        });
    }
}
