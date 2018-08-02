import { Injector } from "./injector";
import { UeliCommandsSearchPlugin } from "./search-plugins/ueli-commands-plugin";
import { FileSearchPlugin } from "./search-plugins/file-search-plugin";
import { ProgramsPlugin } from "./search-plugins/programs-plugin";
import { SearchPlugin } from "./search-plugins/search-plugin";
import { platform } from "os";
import { ProgramFileRepository } from "./programs-plugin/program-file-repository";
import { ConfigOptions } from "./config-options";
import { CustomCommandsPlugin } from "./search-plugins/custom-commands-plugin";
import { IconSet } from "./icon-sets/icon-set";
import { EnvironmentVariablePlugin } from "./search-plugins/environment-variable-plugin";

export class SearchPluginManager {
    private plugins: SearchPlugin[];

    public constructor(config: ConfigOptions, iconSet: IconSet, environmentVariableCollection: { [key: string]: string }) {
        this.plugins = [
            new ProgramsPlugin(new ProgramFileRepository(config.applicationFolders, config.applicationFileExtensions)),
            new FileSearchPlugin(config.fileSearchOptions),
            new UeliCommandsSearchPlugin(),
            new CustomCommandsPlugin(config.customCommands, iconSet.customShortCutIcon),
        ];

        if (config.searchOperatingSystemSettings) {
            this.plugins.push(Injector.getOperatingSystemSettingsPlugin(platform()));
        }

        if (config.searchEnvironmentVariables) {
            this.plugins.push(new EnvironmentVariablePlugin(environmentVariableCollection));
        }
    }

    public getPlugins(): SearchPlugin[] {
        return this.plugins;
    }
}
