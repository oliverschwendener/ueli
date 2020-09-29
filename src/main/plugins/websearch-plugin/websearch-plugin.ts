import { SearchResultItem } from "../../../common/search-result-item";
import { PluginType } from "../../plugin-type";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { WebSearchOptions } from "../../../common/config/websearch-options";
import { ExecutionPlugin } from "../../execution-plugin";
import { WebSearchEngine } from "./web-search-engine";
import { TranslationSet } from "../../../common/translation/translation-set";
import { defaultWebSearchIcon } from "../../../common/icon/default-icons";
import { isValidIcon } from "../../../common/icon/icon-helpers";
import axios from "axios";
import { Logger } from "../../../common/logger/logger";

export class WebSearchPlugin implements ExecutionPlugin {
    public readonly pluginType = PluginType.WebSearchPlugin;
    private config: WebSearchOptions;
    private translationSet: TranslationSet;
    private readonly urlExecutor: (url: string) => Promise<void>;
    private readonly logger: Logger;

    constructor(userConfig: WebSearchOptions, translationSet: TranslationSet, logger: Logger, urlExecutor: (url: string) => Promise<void>) {
        this.config = userConfig;
        this.translationSet = translationSet;
        this.urlExecutor = urlExecutor;
        this.logger = logger;
    }

    public getSearchResults(userInput: string, fallback?: boolean): Promise<SearchResultItem[]> {
        return new Promise((resolve, reject) => {
            const searchResults: SearchResultItem[] = [];
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

            webSearchEngines.forEach((webSearchEngine) => {
                searchResults.push({
                    description: this.buildDescription(webSearchEngine, userInput),
                    executionArgument: this.buildExecutionArgument(webSearchEngine, userInput),
                    hideMainWindowAfterExecution: true,
                    icon: isValidIcon(webSearchEngine.icon) ? webSearchEngine.icon : defaultWebSearchIcon,
                    name: userInput.replace(webSearchEngine.prefix, ""),
                    originPluginType: this.pluginType,
                    searchable: [],
                });
            })

            const suggestionPromises = webSearchEngines.map(webSearchEngine => this.suggestionResolver(webSearchEngine, userInput))
            Promise.all(suggestionPromises).then(responses => {
                let resultsInsterted = 0;
                responses.forEach((response, index) => {
                    searchResults.splice(index + 1 + resultsInsterted, 0, ...response);
                    resultsInsterted += response.length;
                });
                resolve(searchResults);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    private suggestionResolver(webSearchEngine: WebSearchEngine, userInput: string): Promise<SearchResultItem[]> {
        return new Promise((resolve, reject) => {
            if (webSearchEngine.suggestionUrl) {
                axios.get(webSearchEngine.suggestionUrl.replace("{{query}}", this.getSearchTerm(webSearchEngine, userInput)))
                    .then((response => {
                        const suggestionsResults: SearchResultItem[] = [];
                        const suggestionsData = response.data[1];

                        suggestionsData.some((suggestion: string,index:number) => {
                            suggestionsResults.push({
                                description: this.buildDescription(webSearchEngine, suggestion),
                                executionArgument: this.buildExecutionArgument(webSearchEngine, suggestion),
                                hideMainWindowAfterExecution: true,
                                icon: isValidIcon(webSearchEngine.icon) ? webSearchEngine.icon : defaultWebSearchIcon,
                                name: suggestion,
                                originPluginType: this.pluginType,
                                searchable: [],
                            })

                            return index === 7;
                        })
                        resolve(suggestionsResults)
                    }))
                    .catch(error => {
                        this.logger.error(error)
                        resolve([])
                    })
            } else {
                resolve([])
            }
        })
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
