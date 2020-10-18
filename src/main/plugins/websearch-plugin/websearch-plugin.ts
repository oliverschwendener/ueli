import { SearchResultItem } from "../../../common/search-result-item";
import { PluginType } from "../../plugin-type";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { WebSearchOptions } from "../../../common/config/websearch-options";
import { ExecutionPlugin } from "../../execution-plugin";
import { WebSearchEngine } from "./web-search-engine";
import { TranslationSet } from "../../../common/translation/translation-set";
import { defaultWebSearchIcon } from "../../../common/icon/default-icons";
import { isValidIcon } from "../../../common/icon/icon-helpers";

export class WebSearchPlugin implements ExecutionPlugin {
    public readonly pluginType = PluginType.WebSearchPlugin;
    private config: WebSearchOptions;
    private translationSet: TranslationSet;
    private readonly urlExecutor: (url: string) => Promise<void>;
    private readonly suggestionResolver: (url: string) => Promise<any>;

    constructor(
        userConfig: WebSearchOptions,
        translationSet: TranslationSet,
        urlExecutor: (url: string) => Promise<void>,
        suggestionResolver: (url: string) => Promise<any>,
    ) {
        this.config = userConfig;
        this.translationSet = translationSet;
        this.urlExecutor = urlExecutor;
        this.suggestionResolver = suggestionResolver;
    }

    public getSearchResults(userInput: string, fallback?: boolean): Promise<SearchResultItem[]> {
        return new Promise((resolve, reject) => {
            const webSearchEngines = this.config.webSearchEngines
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
                });

            const suggestionWebSearchEngines = webSearchEngines.filter((webSearchEngine) => {
                return webSearchEngine.suggestionUrl !== undefined;
            });

            this.getSuggestions(suggestionWebSearchEngines, userInput)
                .then((suggestions) => {
                    const results: SearchResultItem[] = [];

                    for (const webSearchEngine of webSearchEngines) {
                        results.push({
                            description: this.buildDescription(webSearchEngine, userInput),
                            executionArgument: this.buildExecutionArgument(webSearchEngine, userInput),
                            hideMainWindowAfterExecution: true,
                            icon: isValidIcon(webSearchEngine.icon) ? webSearchEngine.icon : defaultWebSearchIcon,
                            name: webSearchEngine.name,
                            originPluginType: this.pluginType,
                            searchable: [],
                        });
                    }

                    suggestions.forEach((suggestion) => results.push(suggestion));

                    resolve(results);
                })
                .catch((error) => reject(error));
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

    public updateConfig(updatedConfig: UserConfigOptions, translationSet: TranslationSet): Promise<void> {
        return new Promise((resolve) => {
            this.config = updatedConfig.websearchOptions;
            this.translationSet = translationSet;
            resolve();
        });
    }

    private getSearchTerm(webSearchEngine: WebSearchEngine, userInput: string): string {
        let searchTerm = userInput.replace(webSearchEngine.prefix, "");

        if (webSearchEngine.encodeSearchTerm) {
            searchTerm = encodeURIComponent(searchTerm);
        }

        return searchTerm;
    }

    private buildDescription(webSearchEngine: WebSearchEngine, userInput: string): string {
        return this.translationSet.websearchDescription
            .replace("{{websearch_engine}}", webSearchEngine.name)
            .replace("{{search_term}}", this.getSearchTerm(webSearchEngine, userInput));
    }

    private buildExecutionArgument(webSearchEngine: WebSearchEngine, userInput: string): string {
        return this.replaceQueryInUrl(this.getSearchTerm(webSearchEngine, userInput), webSearchEngine.url);
    }

    private userInputMatches(userInput: string, fallback?: boolean): boolean {
        return this.config.webSearchEngines.some((websearchEngine) => {
            return fallback
                ? websearchEngine.isFallback
                : userInput.startsWith(websearchEngine.prefix);
        });
    }

    private getSuggestions(webSearchEngines: WebSearchEngine[], userInput: string): Promise<SearchResultItem[]> {
        return new Promise((resolve, reject) => {
            const promises = webSearchEngines.map((webSearchEngine) => this.getSuggestionsByWebSearchEngine(webSearchEngine, userInput));

            Promise.all(promises)
                .then((lists) => {
                    const result: SearchResultItem[] = [];

                    lists.forEach((list) => {
                        list.forEach((item) => result.push(item));
                    });

                    resolve(result);
                })
                .catch((error) => reject(error));
        });
    }

    private getSuggestionsByWebSearchEngine(websearchEngine: WebSearchEngine, userInput: string): Promise<SearchResultItem[]> {
        const searchTerm = this.getSearchTerm(websearchEngine, userInput);

        return new Promise((resolve, reject) => {
            if (websearchEngine.suggestionUrl && searchTerm) {
                const suggestionUrl = this.replaceQueryInUrl(searchTerm, websearchEngine.suggestionUrl);

                this.suggestionResolver(suggestionUrl)
                    .then((response) => {
                        const suggestions: string[] = response[1];

                        const searchResultItems = suggestions.map((suggestion): SearchResultItem => {
                            return {
                                description: this.buildDescription(websearchEngine, suggestion),
                                executionArgument: this.buildExecutionArgument(websearchEngine, suggestion),
                                hideMainWindowAfterExecution: true,
                                icon: isValidIcon(websearchEngine.icon) ? websearchEngine.icon : defaultWebSearchIcon,
                                name: suggestion,
                                originPluginType: this.pluginType,
                                searchable: [],
                            };
                        });

                        resolve(searchResultItems);
                    })
                    .catch((error) => reject(error));
            } else {
                resolve([]);
            }

        });
    }

    private replaceQueryInUrl(query: string, url: string): string {
        return url.replace(/{{query}}/g, query);
    }
}
