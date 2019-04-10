import { ExecutionPlugin } from "../../execution-plugin";
import { SearchResultItem } from "../../../common/search-result-item";
import { AutoCompletionResult } from "../../../common/auto-completion-result";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { TranslationSet } from "../../../common/translation/translation-set";
import { PluginType } from "../../plugin-type";
import { UrlOptions } from "../../../common/config/url-options";
import { defaultUrlIcon } from "../../../common/icon/default-icons";

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
        const http = "http://";
        const https = "https://";
        const fullUrlRegex = new RegExp(/^((https?:)?[/]{2})?([a-z0-9]+[.])+[a-z]{2,}.*$/i, "gi");
        const stringStartsWithHttpOrHttps = (userInput.startsWith(http) && userInput.length > http.length) || (userInput.startsWith(https) && userInput.length > https.length);
        return (fullUrlRegex.test(userInput) || stringStartsWithHttpOrHttps) && !this.isValidEmailAddress(userInput);
    }

    public getSearchResults(userInput: string, fallback?: boolean | undefined): Promise<SearchResultItem[]> {
        return new Promise((resolve) => {
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

            resolve([result]);
        });
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

    public updateConfig(updatedConfig: UserConfigOptions, translationSet: TranslationSet): Promise<void> {
        return new Promise((resolve) => {
            this.config = updatedConfig.urlOptions;
            this.translationSet = translationSet;
            resolve();
        });
    }

    private isValidEmailAddress(emailAddress: string): boolean {
        const regex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return regex.test(emailAddress);
    }
}
