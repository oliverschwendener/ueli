import { SearchPlugin } from "./search-plugins/search-plugin";
import { ProgramsPlugin } from "./search-plugins/programs-plugin";
import { HomeFolderSearchPlugin } from "./search-plugins/home-folder-plugin";
import { ElectronizrCommandsSearchPlugin } from "./search-plugins/electronizr-commands-plugin";
import { Injector, OperatingSystem } from "./injector";
import { WindowsSettingsSearchPlugin } from "./search-plugins/windows-settings-plugin";
import { Config } from "./config";
import { Windows10AppsSearchPlugin } from "./search-plugins/windows-apps-plugin";

export class SearchPluginManager {
    private os = Injector.getCurrentOperatingSystem();
    private plugins: SearchPlugin[];

    public constructor() {
        this.plugins = [
            new ProgramsPlugin(),
            new HomeFolderSearchPlugin(),
            new ElectronizrCommandsSearchPlugin()
        ];

        if (this.os === OperatingSystem.Windows && Config.searchOperatinSystemSettings) {
            this.plugins.push(new WindowsSettingsSearchPlugin());
        }

        if (this.os === OperatingSystem.Windows && Config.searchWindows10Apps) {
            this.plugins.push(new Windows10AppsSearchPlugin());
        }
    }

    public getPlugins(): SearchPlugin[] {
        return this.plugins;
    }
}