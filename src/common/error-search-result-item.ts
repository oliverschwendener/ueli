import { SearchResultItem } from "./search-result-item";
import { PluginType } from "../main/plugin-type";
import { defaultErrorIcon } from "./icon/default-error-icon";

export const errorSearchResultItem: SearchResultItem = {
    description: "Check ueli's log to see more details",
    executionArgument: "",
    hideMainWindowAfterExecution: false,
    icon: defaultErrorIcon,
    name: "An error occured",
    originPluginType: PluginType.None,
    searchable: [],
};
