import { ExecutionPlugin } from "../../execution-plugin";
import { SearchResultItem } from "../../../common/search-result-item";
import { AutoCompletionResult } from "../../../common/auto-completion-result";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { TranslationSet } from "../../../common/translation/translation-set";
import { PluginType } from "../../plugin-type";
import { EmailOptions } from "../../../common/config/email-options";
import { StringHelpers } from "../../../common/helpers/string-helpers";
import { defaultEmailIcon } from "../../../common/icon/default-icons";

export class EmailPlugin implements ExecutionPlugin {
    public readonly pluginType: PluginType.Email;
    public readonly openLocationSupported = false;
    public readonly autoCompletionSupported = false;
    private readonly urlExecutor: (email: string) => Promise<void>;
    private config: EmailOptions;
    private translationSet: TranslationSet;

    constructor(config: EmailOptions, translationSet: TranslationSet, urlExecutor: (email: string) => Promise<void>) {
        this.config = config;
        this.translationSet = translationSet;
        this.urlExecutor = urlExecutor;
    }

    public isValidUserInput(userInput: string, fallback?: boolean | undefined): boolean {
        return StringHelpers.isValidEmailAddress(userInput);
    }

    public getSearchResults(userInput: string, fallback?: boolean | undefined): Promise<SearchResultItem[]> {
        return new Promise((resolve) => {
            const result: SearchResultItem = {
                description: this.translationSet.openNewMail,
                executionArgument: `mailto:${userInput}`,
                hideMainWindowAfterExecution: true,
                icon: defaultEmailIcon,
                name: userInput,
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
            this.config = updatedConfig.emailOptions;
            this.translationSet = translationSet;
            resolve();
        });
    }
}
