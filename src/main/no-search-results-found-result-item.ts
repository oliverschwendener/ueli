import { SearchResultItem } from "../common/search-result-item";
import { PluginType } from "./plugin-type";
import { defaultErrorIcon } from "../common/icon/default-error-icon";

export const noSearchResultsFoundResultItem: SearchResultItem = {
    description: "",
    executionArgument: "",
    hideMainWindowAfterExecution: false,
    icon: defaultErrorIcon,
    name: "No search results found",
    originPluginType: PluginType.None,
    searchable: [],
};
