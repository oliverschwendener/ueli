import { SearchPlugin } from "./search-plugins/search-plugin";

export interface SearchPluginManager {
    getPlugins(): SearchPlugin[];
}
