import { SearchPlugin } from "./plugins/search-plugin";
import { ProgramsPlugin } from "./plugins/programs-plugin";
import { HomeFolderSearchPlugin } from "./plugins/home-folder-plugin";
import { ElectronizrCommandsSearchPlugin } from "./plugins/electronizr-commands-plugin";

export class SearchPluginManager {
    private plugins: SearchPlugin[];

    constructor() {
        this.plugins = [
            new ProgramsPlugin(),
            new HomeFolderSearchPlugin(),
            new ElectronizrCommandsSearchPlugin()
        ];
    }

    public getPlugins(): SearchPlugin[] {
        return this.plugins;
    }
}