import { SearchPlugin } from "./search-plugins/search-plugin";
import { ProgramsPlugin } from "./search-plugins/programs-plugin";
import { HomeFolderSearchPlugin } from "./search-plugins/home-folder-plugin";
import { ElectronizrCommandsSearchPlugin } from "./search-plugins/electronizr-commands-plugin";

export class SearchPluginManager {
    private plugins: SearchPlugin[];

    public constructor() {
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