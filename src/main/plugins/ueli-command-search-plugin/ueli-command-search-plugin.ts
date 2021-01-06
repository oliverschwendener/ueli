import { SearchPlugin } from "../../search-plugin";
import { PluginType } from "../../plugin-type";
import { SearchResultItem } from "../../../common/search-result-item";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { UeliCommand } from "./ueli-command";
import { IconType } from "../../../common/icon/icon-type";
import { UeliCommandExecutionArgument } from "./ueli-command-execution-argument";
import { ipcMain } from "electron";
import { IpcChannels } from "../../../common/ipc-channels";
import { TranslationSet } from "../../../common/translation/translation-set";

export class UeliCommandSearchPlugin implements SearchPlugin {
    public readonly pluginType = PluginType.UeliCommandSearchPlugin;
    private translationSet: TranslationSet;
    private readonly icon = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="m18.8 4.4c-.3.2-.5.5-.5.9v10.2c0 .4-.2.7-.5.9l-2.8 1.7c-.7.4-1.5-.1-1.5-.9v-9.1c0-.4-.2-.7-.5-.9l-3.7-2.3c-.3-.2-.7-.2-1 0l-3.8 2.3c-.3.2-.5.5-.5.9v15.8c0 .4.2.7.5.9l8.6 5.1c.3.2.7.2 1 0l13.4-7.9c.3-.2.5-.5.5-.9v-15.9c0-.4-.2-.7-.5-.9l-3.8-2.2c-.2-.1-.6-.1-.8 0z"/></svg>`;

    constructor(translationSet: TranslationSet) {
        this.translationSet = translationSet;
    }

    public isEnabled(): boolean {
        return true;
    }

    public getAll(): Promise<SearchResultItem[]> {
        return new Promise((resolve) => {
            const result = this.getAllCommands().map((command) => this.createSearchResultItemFromUeliCommand(command));
            resolve(result);
        });
    }

    public execute(searchResultItem: SearchResultItem): Promise<void> {
        return new Promise((resolve, reject) => {
            const ueliCommand = this.getAllCommands().find((command) => command.executionArgument === searchResultItem.executionArgument);
            if (ueliCommand) {
                ipcMain.emit(IpcChannels.ueliCommandExecuted, ueliCommand);
                resolve();
            } else {
                reject("Error while trying to execute ueli command: Invalid ueli command");
            }
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

    public updateConfig(updatedConfig: UserConfigOptions, tranlsationSet: TranslationSet): Promise<void> {
        return new Promise((resolve) => {
            this.translationSet = tranlsationSet;
            resolve();
        });
    }

    private createSearchResultItemFromUeliCommand(ueliCommand: UeliCommand): SearchResultItem {
        return {
            description: ueliCommand.description,
            executionArgument: ueliCommand.executionArgument,
            hideMainWindowAfterExecution: ueliCommand.hideMainWindowAfterExecution,
            icon: {
                parameter: this.icon,
                type: IconType.SVG,
            },
            name: ueliCommand.name,
            originPluginType: this.pluginType,
            searchable: [ueliCommand.name],
        };
    }

    private getAllCommands(): UeliCommand[] {
        return [
            {
                description: this.translationSet.ueliCommandExitDescription,
                executionArgument: UeliCommandExecutionArgument.Exit,
                hideMainWindowAfterExecution: true,
                name: this.translationSet.ueliCommandExit,
            },
            {
                description: this.translationSet.ueliCommandReloadDescription,
                executionArgument: UeliCommandExecutionArgument.Reload,
                hideMainWindowAfterExecution: false,
                name: this.translationSet.ueliCommandReload,
            },
            {
                description: this.translationSet.ueliCommandEditSettingsFileDescription,
                executionArgument: UeliCommandExecutionArgument.EditConfigFile,
                hideMainWindowAfterExecution: true,
                name: this.translationSet.ueliCommandEditSettingsFile,
            },
            {
                description: this.translationSet.ueliCommandOpenSettingsDescription,
                executionArgument: UeliCommandExecutionArgument.OpenSettings,
                hideMainWindowAfterExecution: false,
                name: this.translationSet.ueliCommandOpenSettings,
            },
            {
                description: this.translationSet.ueliCommandRefreshIndexesDescription,
                executionArgument: UeliCommandExecutionArgument.RefreshIndexes,
                hideMainWindowAfterExecution: false,
                name: this.translationSet.ueliCommandRefreshIndexes,
            },
            {
                description: this.translationSet.ueliCommandClearCachesDescription,
                executionArgument: UeliCommandExecutionArgument.ClearCaches,
                hideMainWindowAfterExecution: false,
                name: this.translationSet.ueliCommandClearCaches,
            },
        ];
    }
}
