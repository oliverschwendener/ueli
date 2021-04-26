import { ExecutionPlugin } from "../../execution-plugin";
import { SearchResultItem } from "../../../common/search-result-item";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { TranslationSet } from "../../../common/translation/translation-set";
import { PluginType } from "../../plugin-type";
import { UrlOptions } from "../../../common/config/url-options";
import { defaultUrlIcon } from "../../../common/icon/default-icons";
import { isValidUrl } from "../../../common/helpers/url-helpers";

export class UrlPlugin implements ExecutionPlugin {
    public readonly pluginType = PluginType.Url;
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

    public getSearchResults(userInput: string, fallback?: boolean | undefined): Promise<SearchResultItem[]> {
        return new Promise((resolve) => {
            const urlStartsWithHttp = userInput.startsWith("http://");
            const urlStartsWithHttps = userInput.startsWith("https://");
            const urlStartsWithDoubleSlashes = userInput.startsWith("//");

            const url =
                !urlStartsWithHttp && !urlStartsWithHttps
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

            resolve([result]);
        });
    }

    public isEnabled(): boolean {
        return this.config.isEnabled;
    }

    public execute(searchResultItem: SearchResultItem, privileged: boolean): Promise<void> {
        return this.urlExecutor(searchResultItem.executionArgument);
    }

    public updateConfig(updatedConfig: UserConfigOptions, translationSet: TranslationSet): Promise<void> {
        return new Promise((resolve) => {
            this.config = updatedConfig.urlOptions;
            this.translationSet = translationSet;
            resolve();
        });
    }
}
