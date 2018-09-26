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

export class SearchPluginManager {
    private plugins: SearchPlugin[];

    public constructor(config: UserConfigOptions, iconSet: IconSet, environmentVariableCollection: { [key: string]: string }) {
        this.plugins = [
            new ProgramsPlugin(new ProgramFileRepository(config.applicationFolders, config.applicationFileExtensions), config.iconSet),
            new FileSearchPlugin(config.fileSearchOptions, config.iconSet),
            new UeliCommandsSearchPlugin(),
            new ShortcutsPlugin(config.shortcuts, iconSet.shortcutIcon),
        ];

        if (config.searchOperatingSystemSettings) {
            this.plugins.push(Injector.getOperatingSystemSettingsPlugin(platform(), config.iconSet));
        }

        if (config.searchOperatingSystemCommands) {
            const operatingSystem = OperatingSystemHelpers.getOperatingSystemFromString(platform());

            const systemComands = operatingSystem === OperatingSystem.Windows
                ? windowsSystemCommands
                : macOsSystemCommands;

            this.plugins.push(new OperatingSystemCommandsPlugin(systemComands, operatingSystem));
        }

        if (config.searchEnvironmentVariables) {
            this.plugins.push(new EnvironmentVariablePlugin(environmentVariableCollection, config.iconSet));
        }
    }

    public getPlugins(): SearchPlugin[] {
        return this.plugins;
    }
}
