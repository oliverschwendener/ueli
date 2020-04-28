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

export class WebSearchPlugin implements ExecutionPlugin {
    public readonly pluginType = PluginType.WebSearchPlugin;
    private config: WebSearchOptions;
    private translationSet: TranslationSet;
    private readonly urlExecutor: (url: string) => Promise<void>;

    constructor(userConfig: WebSearchOptions, translationSet: TranslationSet, urlExecutor: (url: string) => Promise<void>) {
        this.config = userConfig;
        this.translationSet = translationSet;
        this.urlExecutor = urlExecutor;
    }

    public getSearchResults(userInput: string, fallback?: boolean): Promise<SearchResultItem[]> {
        return new Promise((resolve, reject) => {
            const searchResults: SearchResultItem[] = [];
            const webSearchEnginesArray = this.config.webSearchEngines
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
            const promises = webSearchEnginesArray.map((webSearchEngine) => {
                return axios({ method: "GET", url: webSearchEngine.suggestionUrl.replace("{{query}}", this.getSearchTerm(webSearchEngine, userInput)) });
            });

            axios.all(promises).then(axios.spread((...responses) => {
                let responseCounter = 0;
                responses.forEach((res) => {
                    const results = res.data[1];
                    searchResults.push({
                        description: this.buildDescription(webSearchEnginesArray[responseCounter], userInput),
                        executionArgument: this.buildExecutionArgument(webSearchEnginesArray[responseCounter], userInput),
                        hideMainWindowAfterExecution: true,
                        icon: isValidIcon(webSearchEnginesArray[responseCounter].icon) ? webSearchEnginesArray[responseCounter].icon : defaultWebSearchIcon,
                        name: userInput.replace(webSearchEnginesArray[responseCounter].prefix, ""),
                        originPluginType: this.pluginType,
                        searchable: [],
                    });
                    results.some((suggestion: string) => {
                        searchResults.push(
                            {

                                description: this.buildDescription(webSearchEnginesArray[responseCounter], suggestion),
                                executionArgument: this.buildExecutionArgument(webSearchEnginesArray[responseCounter], suggestion),
                                hideMainWindowAfterExecution: true,
                                icon: isValidIcon(webSearchEnginesArray[responseCounter].icon) ? webSearchEnginesArray[responseCounter].icon : defaultWebSearchIcon,
                                name: suggestion,
                                originPluginType: this.pluginType,
                                searchable: [],
                            });
                        if (results.length > 8) {
                            return suggestion === results[7];
                        }
                    });
                    responseCounter++;
                });
                resolve(searchResults);
            })).catch((errors) => {
                resolve(searchResults);
            });
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
