import { PluginType } from "../main/plugin-type";
import { Icon } from "./icon";

export interface SearchResultItem {
    description: string;
    executionArgument: string;
    icon: Icon;
    name: string;
    originPluginType: PluginType;
}
