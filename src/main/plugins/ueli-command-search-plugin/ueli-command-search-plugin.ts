import { SearchPlugin } from "../../search-plugin";
import { PluginType } from "../../plugin-type";
import { SearchResultItem } from "../../../common/search-result-item";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { UeliCommand } from "./ueli-command";
import { IconType } from "../../../common/icon/icon-type";
import { UeliCommandExecutionArgument } from "./ueli-command-execution-argument";
import { ipcMain } from "electron";
import { IpcChannels } from "../../../common/ipc-channels";
import { TranslationManager } from "../../../common/translation/translation-manager";
import { TranslationKey } from "../../../common/translation/translation-key";

export class UeliCommandSearchPlugin implements SearchPlugin {
    public readonly pluginType = PluginType.UeliCommandSearchPlugin;
    public readonly openLocationSupported = false;
    private readonly translationManager: TranslationManager;
    private readonly icon = `
    <svg version="1.1" id="Ebene_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        viewBox="0 0 600 600" xml:space="preserve">
        <path d="M59,121.6l81.3-46.9c5.9-3.4,13.1-3.4,18.9,0l80.8,46.9c5.8,3.4,9.4,9.6,9.4,16.4v187.2c0,14.6,15.8,23.7,28.4,16.4l62.4-36
            c5.9-3.4,9.5-9.6,9.5-16.4l0-209c0-6.8,3.6-13,9.5-16.4l81-46.8c5.9-3.4,13.1-3.4,18.9,0l81,46.8c5.9,3.4,9.5,9.6,9.5,16.4v324.4
            c0,6.8-3.6,13-9.5,16.4L259.2,583.1c-5.9,3.4-13.1,3.4-18.9,0L59,478.4c-5.9-3.4-9.5-9.6-9.5-16.4V137.9
            C49.6,131.2,53.2,124.9,59,121.6z"/>
    </svg>
    `;

    constructor(translationManager: TranslationManager) {
        this.translationManager = translationManager;
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

    public openLocation(searchResultItem: SearchResultItem): Promise<void> {
        throw new Error("Opening location is not supported on this plugin");
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

    public updateConfig(updatedConfig: UserConfigOptions): Promise<void> {
        return new Promise((resolve) => {
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
            searchable: [ueliCommand.name, ueliCommand.description, "ueli"],
        };
    }

    private getAllCommands(): UeliCommand[] {
        return [
            {
                description: this.translationManager.getTranslation(TranslationKey.UeliCommandQuitDescription),
                executionArgument: UeliCommandExecutionArgument.Exit,
                hideMainWindowAfterExecution: true,
                name: this.translationManager.getTranslation(TranslationKey.UeliCommandQuit),
            },
            {
                description: this.translationManager.getTranslation(TranslationKey.UeliCommandReloadDescription),
                executionArgument: UeliCommandExecutionArgument.Reload,
                hideMainWindowAfterExecution: false,
                name: this.translationManager.getTranslation(TranslationKey.UeliCommandReload),
            },
            {
                description: this.translationManager.getTranslation(TranslationKey.UeliCommandEditSettingsFileDescription),
                executionArgument: UeliCommandExecutionArgument.EditConfigFile,
                hideMainWindowAfterExecution: true,
                name: this.translationManager.getTranslation(TranslationKey.UeliCommandEditSettingsFile),
            },
            {
                description: this.translationManager.getTranslation(TranslationKey.UeliCommandOpenSettingsDescription),
                executionArgument: UeliCommandExecutionArgument.OpenSettings,
                hideMainWindowAfterExecution: false,
                name: this.translationManager.getTranslation(TranslationKey.UeliCommandOpenSettings),
            },
            {
                description: this.translationManager.getTranslation(TranslationKey.UeliCommandRefreshIndexesDescription),
                executionArgument: UeliCommandExecutionArgument.RefreshIndexes,
                hideMainWindowAfterExecution: false,
                name: this.translationManager.getTranslation(TranslationKey.UeliCommandRefreshIndexes),
            },
            {
                description: this.translationManager.getTranslation(TranslationKey.UeliCommandClearCachesDescription),
                executionArgument: UeliCommandExecutionArgument.ClearCaches,
                hideMainWindowAfterExecution: false,
                name: this.translationManager.getTranslation(TranslationKey.UeliCommandClearCaches),
            },
        ];
    }
}
