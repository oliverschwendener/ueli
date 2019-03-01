import { PluginType } from "../main/plugin-type";
import { Icon } from "./icon/icon";

export interface SearchResultItem {
    description: string;
    executionArgument: string;
    hideMainWindowAfterExecution: boolean;
    icon: Icon;
    name: string;
    originPluginType: PluginType;
    searchable: string[];
}
