import { PluginType } from "../main/plugin-type";

export interface SearchResultItem {
    description: string;
    executionArgument: string;
    icon: string;
    name: string;
    originPluginType: PluginType;
}
