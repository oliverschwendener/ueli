import type { SearchResultItem } from "@Shared/Core";

export const getPreviousSearchResultItemId = (
    currentlySelectedItemId: string,
    searchResultItems: SearchResultItem[],
): string => {
    if (searchResultItems.length === 0) {
        return "";
    }

    const previousItemIndex =
        searchResultItems.findIndex((searchResultItem) => searchResultItem.id === currentlySelectedItemId) - 1;

    return previousItemIndex === -1
        ? searchResultItems[searchResultItems.length - 1].id
        : searchResultItems[previousItemIndex].id;
};
