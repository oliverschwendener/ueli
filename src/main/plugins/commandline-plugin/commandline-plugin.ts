import { ExecutionPlugin } from "../../execution-plugin";
import { PluginType } from "../../plugin-type";
import { SearchResultItem } from "../../../common/search-result-item";
import { AutoCompletionResult } from "../../../common/auto-completion-result";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { TranslationSet } from "../../../common/translation/translation-set";
import { defaultTerminalIcon } from "../../../common/icon/default-icons";
import { CommandlineOptions } from "../../../common/config/commandline-options";

export class CommandlinePlugin implements ExecutionPlugin {
    public pluginType = PluginType.Commandline;
    public readonly openLocationSupported = false;
    public readonly autoCompletionSupported = false;
    private readonly commandlineExecutor: (command: string) => Promise<void>;
    private config: CommandlineOptions;
    private translationSet: TranslationSet;

    constructor(config: CommandlineOptions, translationSet: TranslationSet, commandlineExecutor: (command: string) => Promise<void>) {
        this.config = config;
        this.translationSet = translationSet;
        this.commandlineExecutor = commandlineExecutor;
    }

    public isValidUserInput(userInput: string, fallback?: boolean | undefined): boolean {
        return userInput.startsWith(this.config.prefix)
            && userInput.length > this.config.prefix.length;
    }

    public getSearchResults(userInput: string, fallback?: boolean | undefined): Promise<SearchResultItem[]> {
        return new Promise((resolve, reject) => {
            const command = userInput.replace(">", "").trim();
            const result: SearchResultItem = {
                description: this.translationSet.commandlineSearchResultDescription.replace("{{command}}", command),
                executionArgument: command,
                hideMainWindowAfterExecution: true,
                icon: defaultTerminalIcon,
                name: command,
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
        return this.commandlineExecutor(searchResultItem.executionArgument);
    }

    public openLocation(searchResultItem: SearchResultItem): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public autoComplete(searchResultItem: SearchResultItem): Promise<AutoCompletionResult> {
        throw new Error("Method not implemented.");
    }

    public updateConfig(updatedConfig: UserConfigOptions, translationSet: TranslationSet): Promise<void> {
        return new Promise((resolve) => {
            this.config = updatedConfig.commandlineOptions;
            this.translationSet = translationSet;
            resolve();
        });
    }
}
