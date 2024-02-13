import type { SearchResultItem } from "@common/Core";
import { Text } from "@fluentui/react-components";
import type { RefObject } from "react";
import { useTranslation } from "react-i18next";
import { SearchResultListItem } from "./SearchResultListItem";

type SearchResultListProps = {
    containerRef: RefObject<HTMLDivElement>;
    selectedItemIndex: number;
    searchResultItems: SearchResultItem[];
    favorites: string[];
    searchTerm?: string;
    onSearchResultItemClick: (index: number) => void;
    onSearchResultItemDoubleClick: (searchResultItem: SearchResultItem) => void;
};

export const SearchResultList = ({
    containerRef,
    selectedItemIndex,
    searchResultItems,
    favorites,
    searchTerm,
    onSearchResultItemClick,
    onSearchResultItemDoubleClick,
}: SearchResultListProps) => {
    const { t } = useTranslation();

    const noResultsFoundMessage = searchTerm
        ? `${t("noResultsFoundFor", { ns: "search" })} "${searchTerm}"`
        : t("noResultsFound", { ns: "search" });

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                padding: 10,
                boxSizing: "border-box",
            }}
        >
            {searchTerm?.length && !searchResultItems.length ? (
                <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Text>{noResultsFoundMessage}</Text>
                </div>
            ) : null}
            {searchResultItems.map((searchResultItem, index) => (
                <SearchResultListItem
                    containerRef={containerRef}
                    key={searchResultItem.id}
                    isSelected={selectedItemIndex === index}
                    isFavorite={favorites.includes(searchResultItem.id)}
                    searchResultItem={searchResultItem}
                    onClick={() => onSearchResultItemClick(index)}
                    onDoubleClick={() => onSearchResultItemDoubleClick(searchResultItem)}
                />
            ))}
        </div>
    );
};
