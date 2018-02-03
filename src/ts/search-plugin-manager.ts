import { SearchPlugin } from "./plugins/search-plugin";
import { ProgramsPlugin } from "./plugins/programs-plugin";

export class SearchPluginManager {
    private plugins: SearchPlugin[];

    constructor() {
        this.plugins = [
            new ProgramsPlugin()
        ];
    }

    public getPlugins(): SearchPlugin[] {
        return this.plugins;
    }
}