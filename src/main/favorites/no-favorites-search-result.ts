import { SearchResultItem } from "../../common/search-result-item";
import { PluginType } from "../plugin-type";
import { defaultNoSearchResultIcon } from "../../common/icon/default-icons";
import { TranslationSet } from "../../common/translation/translation-set";

export function getNoFavoritesSearchResult(translationSet: TranslationSet): SearchResultItem {
    return {
        description: translationSet.noFavoritesFoundDescription,
        executionArgument: "",
        hideMainWindowAfterExecution: true,
        icon: defaultNoSearchResultIcon,
        name: translationSet.noFavoritesFoundTitle,
        originPluginType: PluginType.None,
        searchable: [],
    };
}
