import { Injector } from "./injector";
import { UeliCommandsSearchPlugin } from "./search-plugins/ueli-commands-plugin";
import { FileSearchPlugin } from "./search-plugins/file-search-plugin";
import { ProgramsPlugin } from "./search-plugins/programs-plugin";
import { SearchPlugin } from "./search-plugins/search-plugin";
import { platform } from "os";
import { ProgramFileRepository } from "./programs-plugin/program-file-repository";
import { UserConfigOptions } from "./user-config/user-config-options";
import { ShortcutsPlugin } from "./search-plugins/shortcuts-plugin";
import { IconSet } from "./icon-sets/icon-set";
import { EnvironmentVariablePlugin } from "./search-plugins/environment-variable-plugin";
import { OperatingSystemCommandsPlugin } from "./search-plugins/operating-system-commands-plugin";
import { OperatingSystemHelpers } from "./helpers/operating-system-helpers";
import { OperatingSystem } from "./operating-system";
import { windowsSystemCommands } from "./operating-system-settings/windows/windows-system-commands";
import { macOsSystemCommands } from "./operating-system-settings/macos/mac-os-system-commands";
import { ipcMain } from "electron";
import { IpcChannels } from "./ipc-channels";

export class SearchPluginManager {
    private readonly plugins: SearchPlugin[];

    public constructor(config: UserConfigOptions, iconSet: IconSet, environmentVariableCollection: { [key: string]: string }) {
        this.plugins = [];

        if (config.features.ueliCommands) {
            this.plugins.push(new UeliCommandsSearchPlugin());
        }

        if (config.features.shortcuts) {
            this.plugins.push(new ShortcutsPlugin(config.shortcuts, iconSet.shortcutIcon));
        }

        if (config.features.programs) {
            this.plugins.push(new ProgramsPlugin(new ProgramFileRepository(config.applicationFolders, config.applicationFileExtensions, config.fileSearchBlackList), config.iconSet));
        }

        if (config.features.fileSearch) {
            this.plugins.push(new FileSearchPlugin(config.fileSearchOptions, config.iconSet, config.fileSearchBlackList));
        }

        if (config.features.operatingSystemSettings) {
            this.plugins.push(Injector.getOperatingSystemSettingsPlugin(platform(), config.iconSet));
        }

        if (config.features.operatingSystemCommands) {
            const operatingSystem = OperatingSystemHelpers.getOperatingSystemFromString(platform());

            const systemComands = operatingSystem === OperatingSystem.Windows
                ? windowsSystemCommands
                : macOsSystemCommands;

            this.plugins.push(new OperatingSystemCommandsPlugin(systemComands, operatingSystem));
        }

        if (config.features.environmentVariables) {
            this.plugins.push(new EnvironmentVariablePlugin(environmentVariableCollection, config.iconSet));
        }

        ipcMain.on(IpcChannels.getIndexLength, (event: Electron.Event): void => {
            event.sender.send(IpcChannels.getIndexLengthResponse, this.getIndexLength());
        });
    }

    public getPlugins(): SearchPlugin[] {
        return this.plugins;
    }

    private getIndexLength(): number {
        let result = 0;

        for (const plugin of this.plugins) {
            result += plugin.getIndexLength();
        }

        return result;
    }
}
