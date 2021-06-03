import { SearchPlugin } from "../../search-plugin";
import { SearchResultItem } from "../../../common/search-result-item";
import { PluginType } from "../../plugin-type";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { TranslationSet } from "../../../common/translation/translation-set";
import { OperatingSystemCommandsOptions } from "../../../common/config/operating-system-commands-options";
import { OperatingSystemCommandRepository } from "./operating-system-commands-repository";

export class OperatingSystemCommandsPlugin implements SearchPlugin {
    public pluginType = PluginType.OperatingSystemCommandsPlugin;
    private config: OperatingSystemCommandsOptions;
    private readonly operatingSystemCommandRepository: OperatingSystemCommandRepository;
    private readonly commandExecutor: (command: string) => Promise<void>;

    constructor(
        config: OperatingSystemCommandsOptions,
        operatingSystemCommandRepository: OperatingSystemCommandRepository,
        commandExecutor: (command: string) => Promise<void>,
    ) {
        this.config = config;
        this.operatingSystemCommandRepository = operatingSystemCommandRepository;
        this.commandExecutor = commandExecutor;
    }

    public getAll(): Promise<SearchResultItem[]> {
        return new Promise((resolve, reject) => {
            this.operatingSystemCommandRepository
                .getAll()
                .then((commands) => {
                    if (commands.length === 0) {
                        resolve([]);
                    } else {
                        const result = commands.map(
                            (command): SearchResultItem => {
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
                            },
                        );
                        resolve(result);
                    }
                })
                .catch((err) => reject(err));
        });
    }

    public refreshIndex(): Promise<void> {
        return new Promise((resolve) => {
            resolve();
        });
    }

    public clearCache(): Promise<void> {
        return new Promise((resolve) => {
            resolve();
        });
    }

    public isEnabled(): boolean {
        return this.config.isEnabled;
    }

    public execute(searchResultItem: SearchResultItem, privileged: boolean): Promise<void> {
        return this.commandExecutor(searchResultItem.executionArgument);
    }

    public updateConfig(updatedConfig: UserConfigOptions, translationSet: TranslationSet): Promise<void> {
        return new Promise((resolve, reject) => {
            this.config = updatedConfig.operatingSystemCommandsOptions;
            this.operatingSystemCommandRepository
                .updateConfig(updatedConfig, translationSet)
                .then(() => resolve())
                .catch((err) => reject(err));
        });
    }
}
