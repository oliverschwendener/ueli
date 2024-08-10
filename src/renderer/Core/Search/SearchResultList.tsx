import type { SearchResultItem } from "@common/Core";
import { Text } from "@fluentui/react-components";
import type { RefObject } from "react";
import { useTranslation } from "react-i18next";
import { useSetting } from "../Hooks";
import { SearchResultListItem } from "./SearchResultListItem";

type SearchResultListProps = {
    containerRef: RefObject<HTMLDivElement>;
    selectedItemId: string;
    searchResultItems: SearchResultItem[];
    searchTerm?: string;
    onSearchResultItemClick: (searchResultItem: SearchResultItem) => void;
    onSearchResultItemDoubleClick: (searchResultItem: SearchResultItem) => void;
};

export const SearchResultList = ({
    containerRef,
    selectedItemId,
    searchResultItems,
    searchTerm,
    onSearchResultItemClick,
    onSearchResultItemDoubleClick,
}: SearchResultListProps) => {
    const { t } = useTranslation();

    const { value: scrollBehaviour } = useSetting<ScrollBehavior>({
        key: "window.scrollBehavior",
        defaultValue: "smooth",
    });

    const noResultsFoundMessage = searchTerm
        ? `${t("noResultsFoundFor", { ns: "search" })} "${searchTerm}"`
        : t("noResultsFound", { ns: "search" });

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: 5,
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
                    searchResultItem={searchResultItem}
                    onClick={() => onSearchResultItemClick(searchResultItem)}
                    onDoubleClick={() => onSearchResultItemDoubleClick(searchResultItem)}
                    scrollBehaviour={scrollBehaviour}
                />
            ))}
        </div>
    );
};
