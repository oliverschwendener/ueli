import type { SearchResultItem } from "@common/Core";

export const getNextSearchResultItemId = (
    currentlySelectedItemId: string,
    searchResultItems: SearchResultItem[],
): string => {
    if (searchResultItems.length === 0) {
        return "";
    }

    const nextItemIndex =
        searchResultItems.findIndex((searchResultItem) => searchResultItem.id === currentlySelectedItemId) + 1;

    return nextItemIndex === searchResultItems.length ? searchResultItems[0].id : searchResultItems[nextItemIndex].id;
};
