import { ExecutionPlugin } from "../../execution-plugin";
import { PluginType } from "../../plugin-type";
import { SearchResultItem } from "../../../common/search-result-item";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { TranslationSet } from "../../../common/translation/translation-set";
import { defaultTerminalIcon } from "../../../common/icon/default-icons";
import { CommandlineOptions } from "../../../common/config/commandline-options";
import { WindowsShell, MacOsShell } from "./shells";
import { Logger } from "../../../common/logger/logger";

export class CommandlinePlugin implements ExecutionPlugin {
    public pluginType = PluginType.Commandline;

    constructor(
        private config: CommandlineOptions,
        private translationSet: TranslationSet,
        private readonly commandlineExecutor: (command: string, shell: WindowsShell | MacOsShell) => Promise<void>,
        private readonly logger: Logger,
    ) {}

    public isValidUserInput(userInput: string, fallback?: boolean | undefined): boolean {
        return userInput.startsWith(this.config.prefix) && userInput.length > this.config.prefix.length;
    }

    public getSearchResults(userInput: string, fallback?: boolean | undefined): Promise<SearchResultItem[]> {
        return new Promise((resolve, reject) => {
            const command = userInput.replace(this.config.prefix, "").trim();
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
        this.commandlineExecutor(searchResultItem.executionArgument, this.config.shell)
            .then(() => {
                /* do nothing */
            })
            .catch((error) => this.logger.error(error));

        // We resolve the execution promise here before the actual execution has been resolved.
        // In case that there is an interactive shell which listens to user input the execution promise resolves only after the shell is closed.
        // See here: https://github.com/oliverschwendener/ueli/issues/395
        return Promise.resolve();
    }

    public updateConfig(updatedConfig: UserConfigOptions, translationSet: TranslationSet): Promise<void> {
        return new Promise((resolve) => {
            this.config = updatedConfig.commandlineOptions;
            this.translationSet = translationSet;
            resolve();
        });
    }
}
