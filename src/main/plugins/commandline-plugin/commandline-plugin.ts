import { ExecutionPlugin } from "../../execution-plugin";
import { PluginType } from "../../plugin-type";
import { SearchResultItem } from "../../../common/search-result-item";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { TranslationSet } from "../../../common/translation/translation-set";
import { defaultTerminalIcon } from "../../../common/icon/default-icons";
import { CommandlineOptions } from "../../../common/config/commandline-options";
import { WindowsShell, MacOsShell } from "./shells";
import { ElectronStoreCommandlineHistoryRepository } from "./electron-store-commandline-history-repository";

export class CommandlinePlugin implements ExecutionPlugin {
    public pluginType = PluginType.Commandline;
    private readonly commandlineExecutor: (command: string, shell: WindowsShell|MacOsShell) => Promise<void>;
    private config: CommandlineOptions;
    private translationSet: TranslationSet;
    private readonly history: ElectronStoreCommandlineHistoryRepository;

    constructor(
        config: CommandlineOptions,
        translationSet: TranslationSet,
        commandlineExecutor: (command: string, shell: WindowsShell|MacOsShell) => Promise<void>,
        history: ElectronStoreCommandlineHistoryRepository,
    ) {
        this.config = config;
        this.translationSet = translationSet;
        this.commandlineExecutor = commandlineExecutor;
        this.history = history;
    }

    public isValidUserInput(userInput: string, fallback?: boolean | undefined): boolean {
        return userInput.startsWith(this.config.prefix);
    }

    public getSearchResults(userInput: string, fallback?: boolean | undefined): Promise<SearchResultItem[]> {
        return new Promise((resolve, reject) => {
            const command = userInput.replace(this.config.prefix, "").trim();
            const searchResults: SearchResultItem[] = [];
            if (command.length !== 0) {
                searchResults.push({
                    description: this.translationSet.commandlineSearchResultDescription.replace("{{command}}", command),
                    executionArgument: command,
                    hideMainWindowAfterExecution: true,
                    icon: defaultTerminalIcon,
                    name: command,
                    originPluginType: this.pluginType,
                    searchable: [],
                })
            }
            searchResults.push(...this.history.getAll());
            resolve(searchResults);
        });
    }

    public isEnabled(): boolean {
        return this.config.isEnabled;
    }

    public execute(searchResultItem: SearchResultItem, privileged: boolean): Promise<void> {
        this.history.add(searchResultItem);
        return this.commandlineExecutor(searchResultItem.executionArgument, this.config.shell);
    }

    public updateConfig(updatedConfig: UserConfigOptions, translationSet: TranslationSet): Promise<void> {
        return new Promise((resolve) => {
            this.config = updatedConfig.commandlineOptions;
            this.translationSet = translationSet;
            resolve();
        });
    }
}
