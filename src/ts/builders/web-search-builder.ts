import { WebSearch } from "../web-search";
import { WebSearchHelpers } from "../helpers/web-search-helper";
import { SearchResultItem } from "../search-result-item";
import { UeliHelpers } from "../helpers/ueli-helpers";
import { StringHelpers } from "../helpers/string-helpers";

export class WebSearchBuilder {
    public static buildSearchTerm(userInput: string, webSearch: WebSearch): string {
        return userInput.replace(`${webSearch.prefix}${WebSearchHelpers.webSearchSeparator}`, "");
    }

    public static buildExecutionUrl(searchTerm: string, webSearch: WebSearch): string {
        searchTerm = searchTerm.trim();

        if (webSearch.whitespaceCharacter !== undefined && webSearch.whitespaceCharacter.length > 0) {
            searchTerm = StringHelpers.replaceWhitespaceWithString(searchTerm, webSearch.whitespaceCharacter);
        }

        if (webSearch.url !== undefined && webSearch.url.indexOf(UeliHelpers.websearchQueryPlaceholder) > -1) {
            return webSearch.url.replace(UeliHelpers.websearchQueryPlaceholder, searchTerm);
        } else {
            return `${webSearch.url}${searchTerm}`;
        }
    }

    public static buildSearchResultItem(userInput: string, webSearch: WebSearch): SearchResultItem {
        const searchTerm = WebSearchBuilder.buildSearchTerm(userInput, webSearch);

        const searchResultItemName = searchTerm.length > 0
            ? `Search ${webSearch.name} for '${searchTerm.trim()}'`
            : `Search ${webSearch.name}`;

        const executionArgument = WebSearchBuilder.buildExecutionUrl(searchTerm, webSearch);

        return {
            description: executionArgument,
            executionArgument,
            icon: webSearch.icon,
            name: searchResultItemName,
            searchable: [],
            tags: [],
        } as SearchResultItem;
    }
}
