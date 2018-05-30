import { Injector } from "./injector";
import { OperatingSystem } from "./operating-system";
import { UeliCommandsSearchPlugin } from "./search-plugins/ueli-commands-plugin";
import { FileSearchPlugin } from "./search-plugins/file-search-plugin";
import { ProgramsPlugin } from "./search-plugins/programs-plugin";
import { SearchPlugin } from "./search-plugins/search-plugin";
import { Windows10SettingsSearchPlugin } from "./search-plugins/windows-10-settings-plugin";
import { platform } from "os";
import { ProgramFileRepository } from "./programs-plugin/program-file-repository";
import { defaultConfig } from "./default-config";
import { UeliHelpers } from "./helpers/ueli-helpers";
import { ConfigOptions } from "./config-options";
import { CustomCommandsPlugin } from "./search-plugins/custom-commands-plugin";
import { IconManager } from "./icon-manager/icon-manager";

export class SearchPluginManager {
    private plugins: SearchPlugin[];

    public constructor(config: ConfigOptions, iconManager: IconManager) {
        this.plugins = [
            new ProgramsPlugin(new ProgramFileRepository(config.applicationFolders, config.applicationFileExtensions)),
            new FileSearchPlugin(config.fileSearchFolders),
            new UeliCommandsSearchPlugin(),
            new CustomCommandsPlugin(config.customCommands, iconManager.getCustomShortCutIcon()),
        ];

        if (config.searchOperatingSystemSettings) {
            this.plugins.push(Injector.getOperatingSystemSettingsPlugin(platform()));
        }
    }

    public getPlugins(): SearchPlugin[] {
        return this.plugins;
    }
}
