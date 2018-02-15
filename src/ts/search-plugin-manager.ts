import { SearchPlugin } from "./search-plugins/search-plugin";
import { ProgramsPlugin } from "./search-plugins/programs-plugin";
import { HomeFolderSearchPlugin } from "./search-plugins/home-folder-plugin";
import { ElectronizrCommandsSearchPlugin } from "./search-plugins/electronizr-commands-plugin";
import { Injector, OperatingSystem } from "./injector";
import { WindowsSettingsPlugin } from "./search-plugins/windows-settings-plugin";

export class SearchPluginManager {
    private plugins: SearchPlugin[];

    public constructor() {
        this.plugins = [
            new ProgramsPlugin(),
            new HomeFolderSearchPlugin(),
            new ElectronizrCommandsSearchPlugin()
        ];

        if (Injector.getCurrentOperatingSystem() === OperatingSystem.Windows) {
            this.plugins.push(new WindowsSettingsPlugin());
        }
    }

    public getPlugins(): SearchPlugin[] {
        return this.plugins;
    }
}