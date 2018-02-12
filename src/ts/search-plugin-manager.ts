import { SearchPlugin } from "./search-plugins/search-plugin";
import { ProgramsPlugin } from "./search-plugins/programs-plugin";
import { HomeFolderSearchPlugin } from "./search-plugins/home-folder-plugin";
import { ElectronizrCommandsSearchPlugin } from "./search-plugins/electronizr-commands-plugin";
import { OsSettinsPlugin } from "./search-plugins/os-settings-plugin";

export class SearchPluginManager {
    private plugins: SearchPlugin[];

    constructor() {
        this.plugins = [
            new ProgramsPlugin(),
            new HomeFolderSearchPlugin(),
            new ElectronizrCommandsSearchPlugin(),
            new OsSettinsPlugin()
        ];
    }

    public getPlugins(): SearchPlugin[] {
        return this.plugins;
    }
}