import { Config } from "./config";
import { Injector } from "./injector";
import { OperatingSystem } from "./operating-system";
import { UeliCommandsSearchPlugin } from "./search-plugins/ueli-commands-plugin";
import { HomeFolderSearchPlugin } from "./search-plugins/home-folder-plugin";
import { ProgramsPlugin } from "./search-plugins/programs-plugin";
import { SearchPlugin } from "./search-plugins/search-plugin";
import { Windows10SettingsSearchPlugin } from "./search-plugins/windows-10-settings-plugin";

export class SearchPluginManager {
    private os = Injector.getCurrentOperatingSystem();
    private plugins: SearchPlugin[];

    public constructor() {
        this.plugins = [
            new ProgramsPlugin(),
            new HomeFolderSearchPlugin(),
            new UeliCommandsSearchPlugin(),
        ];

        if (this.os === OperatingSystem.Windows && Config.searchOperatinSystemSettings) {
            this.plugins.push(Injector.getOperatingSystemSettingsPlugin());
        }
    }

    public getPlugins(): SearchPlugin[] {
        return this.plugins;
    }
}
