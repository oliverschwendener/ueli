import { SearchResultItem } from "./search-result-item";
import { PluginType } from "../main/plugin-type";
import { defaultErrorIcon } from "./icon/default-icons";
import { UeliCommandExecutionArgument } from "../main/plugins/ueli-command-search-plugin/ueli-command-execution-argument";

export function getErrorSearchResultItem(name: string, description?: string): SearchResultItem {
    return {
        description: description ? description : "",
        executionArgument: UeliCommandExecutionArgument.OpenDebugLog,
        hideMainWindowAfterExecution: true,
        icon: defaultErrorIcon,
        name,
        originPluginType: PluginType.UeliCommandSearchPlugin,
        searchable: [],
    };
}
