import { ExecutionPlugin } from "../../execution-plugin";
import { SearchResultItem } from "../../../common/search-result-item";
import { AutoCompletionResult } from "../../../common/auto-completion-result";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { TranslationSet } from "../../../common/translation/translation-set";
import { PluginType } from "../../plugin-type";
import { UrlOptions } from "../../../common/config/url-options";
import { defaultUrlIcon } from "../../../common/icon/default-icons";
import { isValidUrl } from "../../../common/helpers/url-helpers";

export class UrlPlugin implements ExecutionPlugin {
    public readonly pluginType: PluginType.Url;
    public readonly openLocationSupported = false;
    public readonly autoCompletionSupported = false;
    private config: UrlOptions;
    private translationSet: TranslationSet;
    private readonly urlExecutor: (url: string) => Promise<void>;

    constructor(config: UrlOptions, translationSet: TranslationSet, urlExecutor: (url: string) => Promise<void>) {
        this.config = config;
        this.translationSet = translationSet;
        this.urlExecutor = urlExecutor;
    }

    public isValidUserInput(userInput: string, fallback?: boolean | undefined): boolean {
        return isValidUrl(userInput);
    }

    public async getSearchResults(userInput: string, fallback?: boolean | undefined): Promise<SearchResultItem[]> {
        try {
            const urlStartsWithHttp = userInput.startsWith("http://");
            const urlStartsWithHttps = userInput.startsWith("https://");
            const urlStartsWithDoubleSlashes = userInput.startsWith("//");
            const url = !urlStartsWithHttp && !urlStartsWithHttps
                ? urlStartsWithDoubleSlashes
                    ? `${this.config.defaultProtocol}:${userInput}`
                    : `${this.config.defaultProtocol}://${userInput}`
                : userInput;

            const result: SearchResultItem = {
                description: this.translationSet.openUrlWithBrowser,
                executionArgument: url,
                hideMainWindowAfterExecution: true,
                icon: defaultUrlIcon,
                name: url,
                originPluginType: this.pluginType,
                searchable: [],
            };
            return [result];

        } catch (error) {
            return error;
        }
    }

    public isEnabled(): boolean {
        return this.config.isEnabled;
    }

    public execute(searchResultItem: SearchResultItem, privileged: boolean): Promise<void> {
        return this.urlExecutor(searchResultItem.executionArgument);
    }

    public openLocation(searchResultItem: SearchResultItem): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public autoComplete(searchResultItem: SearchResultItem): Promise<AutoCompletionResult> {
        throw new Error("Method not implemented.");
    }

    public async updateConfig(updatedConfig: UserConfigOptions, translationSet: TranslationSet): Promise<void> {
        this.config = updatedConfig.urlOptions;
        this.translationSet = translationSet;
    }
}
