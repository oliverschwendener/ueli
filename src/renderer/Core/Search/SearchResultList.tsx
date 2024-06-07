import type { SearchResultItem } from "@common/Core";
import { Text } from "@fluentui/react-components";
import type { RefObject } from "react";
import { useTranslation } from "react-i18next";
import { SearchResultListItem } from "./SearchResultListItem";

type SearchResultListProps = {
    containerRef: RefObject<HTMLDivElement>;
    selectedItemId: string;
    searchResultItems: SearchResultItem[];
    favorites: string[];
    searchTerm?: string;
    onSearchResultItemClick: (searchResultItem: SearchResultItem) => void;
    onSearchResultItemDoubleClick: (searchResultItem: SearchResultItem) => void;
};

export const SearchResultList = ({
    containerRef,
    selectedItemId,
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
            {searchResultItems.map((searchResultItem) => (
                <SearchResultListItem
                    containerRef={containerRef}
                    key={searchResultItem.id}
                    isSelected={selectedItemId === searchResultItem.id}
                    isFavorite={favorites.includes(searchResultItem.id)}
                    searchResultItem={searchResultItem}
                    onClick={() => onSearchResultItemClick(searchResultItem)}
                    onDoubleClick={() => onSearchResultItemDoubleClick(searchResultItem)}
                />
            ))}
        </div>
    );
};
