import { SearchPlugin } from "../../search-plugin";
import { SearchResultItem } from "../../../common/search-result-item";
import { PluginType } from "../../plugin-type";
import { AutoCompletionResult } from "../../../common/auto-completion-result";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { TranslationSet } from "../../../common/translation/translation-set";
import { OperatingSystemCommandsOptions } from "../../../common/config/operating-system-commands-options";
import { OperatingSystemCommandRepository } from "./operating-system-commands-repository";

export class OperatingSystemCommandsPlugin implements SearchPlugin {
    public pluginType = PluginType.OperatingSystemCommandsPlugin;
    public openLocationSupported = false;
    public autoCompletionSupported = false;
    private config: OperatingSystemCommandsOptions;
    private readonly operatingSystemCommandRepository: OperatingSystemCommandRepository;
    private readonly commandExecutor: (command: string) => Promise<void>;

    constructor(
        config: OperatingSystemCommandsOptions,
        operatingSystemCommandRepository: OperatingSystemCommandRepository,
        commandExecutor: (command: string) => Promise<void>) {
        this.config = config;
        this.operatingSystemCommandRepository = operatingSystemCommandRepository;
        this.commandExecutor = commandExecutor;
    }

    public async getAll(): Promise<SearchResultItem[]> {
        try {
            const commands = await this.operatingSystemCommandRepository.getAll();
            if (commands.length === 0) {
                return [];
            } else {
                const result = commands.map((command): SearchResultItem => {
                    return {
                        description: command.description,
                        executionArgument: command.executionArgument,
                        hideMainWindowAfterExecution: true,
                        icon: command.icon,
                        name: command.name,
                        needsUserConfirmationBeforeExecution: true,
                        originPluginType: this.pluginType,
                        searchable: command.searchable,
                    };
                });
                return result;
            }
        } catch (error) {
            return error;
        }
    }

    public async refreshIndex(): Promise<void> {} // tslint:disable-line

    public async clearCache(): Promise<void> {} // tslint:disable-line

    public isEnabled(): boolean {
        return this.config.isEnabled;
    }

    public execute(searchResultItem: SearchResultItem, privileged: boolean): Promise<void> {
        return this.commandExecutor(searchResultItem.executionArgument);
    }

    public async openLocation(searchResultItem: SearchResultItem): Promise<void> {
        throw Error("openLocation is not supported in operating system commands plugin");
    }

    public autoComplete(searchResultItem: SearchResultItem): Promise<AutoCompletionResult> {
        throw Error("autoComplete is not supported in operating system commands plugin");
    }

    public async updateConfig(updatedConfig: UserConfigOptions, translationSet: TranslationSet): Promise<void> {
        this.config = updatedConfig.operatingSystemCommandsOptions;
        try {
            await this.operatingSystemCommandRepository.updateConfig(updatedConfig, translationSet);
        } catch (error) {
            return error;
        }
    }
}
