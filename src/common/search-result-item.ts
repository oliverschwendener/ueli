import { PluginType } from "../main/plugin-type";

export interface SearchResultItem {
    executionArgument: string;
    icon: string;
    name: string;
    originPluginType: PluginType;
}
