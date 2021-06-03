import { PluginType } from "../main/plugin-type";
import { Icon } from "./icon/icon";

export interface SearchResultItem {
    description: string;
    executionArgument: string;
    hideMainWindowAfterExecution: boolean;
    icon: Icon;
    name: string;
    needsUserConfirmationBeforeExecution?: boolean;
    originPluginType: PluginType;
    searchable: string[];
    supportsAutocompletion?: boolean;
    supportsOpenLocation?: boolean;
}

export interface SearchResultItemViewModel extends SearchResultItem {
    active: boolean;
    id: string;
    resultNumber: number;
}

export function createSearchResultItemViewModel(
    searchResult: SearchResultItem,
    counter: number,
): SearchResultItemViewModel {
    return {
        active: false,
        description: searchResult.description,
        executionArgument: searchResult.executionArgument,
        hideMainWindowAfterExecution: searchResult.hideMainWindowAfterExecution,
        icon: searchResult.icon,
        id: `search-result-item-${counter}`,
        name: searchResult.name,
        needsUserConfirmationBeforeExecution: searchResult.needsUserConfirmationBeforeExecution,
        originPluginType: searchResult.originPluginType,
        resultNumber: counter,
        searchable: searchResult.searchable,
        supportsAutocompletion: searchResult.supportsAutocompletion,
        supportsOpenLocation: searchResult.supportsOpenLocation,
    };
}
