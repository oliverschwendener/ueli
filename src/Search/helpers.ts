import { SearchResultItem } from "@common/SearchResultItem";

export const filterSearchResultItemsBySearchTerm = (searchResultItems: SearchResultItem[], searchTerm: string) =>
    searchResultItems.filter((searchResultItem) =>
        `${searchResultItem.name.toLowerCase()}${searchResultItem.description.toLowerCase()}`.includes(
            searchTerm.trim().toLowerCase(),
        ),
    );

export const elementIsVisible = (childElement: HTMLElement, parentElement: HTMLElement): boolean => {
    const { container, element } = {
        container: {
            min: parentElement.scrollTop,
            max: parentElement.scrollTop + parentElement.clientHeight,
        },
        element: {
            offsetTop: childElement.offsetTop - parentElement.offsetTop,
            offsetBottom: childElement.offsetTop - parentElement.offsetTop + childElement.clientHeight,
        },
    };

    return element.offsetTop >= container.min && element.offsetBottom <= container.max;
};
