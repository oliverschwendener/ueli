import { SearchPluginManager } from "../ts/search-plugin-manager";
import { SearchPlugin } from "../ts/search-plugins/search-plugin";

export class FakeSearchPluginManager implements SearchPluginManager {
    private readonly plugins: SearchPlugin[];

    constructor(plugins: SearchPlugin[]) {
        this.plugins = plugins;
    }

    public getPlugins(): SearchPlugin[] {
        return this.plugins;
    }
}
