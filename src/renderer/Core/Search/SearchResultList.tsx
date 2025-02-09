import type { SearchResultItem } from "@common/Core";
import { type BadgeProps, Text, type TextProps } from "@fluentui/react-components";
import type { RefObject } from "react";
import { useTranslation } from "react-i18next";
import { useSetting } from "../Hooks";
import { SearchResultListItem } from "./SearchResultListItem";
import type { SearchResultListLayout } from "./SearchResultListLayout";

type SearchResultListProps = {
    containerRef: RefObject<HTMLDivElement>;
    selectedItemId: string;
    searchResultItems: SearchResultItem[];
    searchTerm?: string;
    onSearchResultItemClick: (searchResultItem: SearchResultItem) => void;
    onSearchResultItemDoubleClick: (searchResultItem: SearchResultItem) => void;
    layout: SearchResultListLayout;
};

export const SearchResultList = ({
    containerRef,
    selectedItemId,
    searchResultItems,
    searchTerm,
    onSearchResultItemClick,
    onSearchResultItemDoubleClick,
    layout,
}: SearchResultListProps) => {
    const { t } = useTranslation();

    const { value: scrollBehavior } = useSetting<ScrollBehavior>({
        key: "window.scrollBehavior",
        defaultValue: "smooth",
    });

    const { value: searchResultListItemNameTextSize } = useSetting<TextProps["size"]>({
        key: "appearance.searchResultListItemNameTextSize",
        defaultValue: 300,
    });

    const { value: searchResultListItemDetailsTextSize } = useSetting<TextProps["size"]>({
        key: "appearance.searchResultListItemDetailsTextSize",
        defaultValue: 200,
    });

    const { value: searchResultListItemNameTextWeight } = useSetting<TextProps["weight"]>({
        key: "appearance.searchResultListItemNameTextWeight",
        defaultValue: "semibold",
    });

    const { value: showSearchResultItemIcon } = useSetting<boolean>({
        key: "appearance.showSearchResultItemIcon",
        defaultValue: true,
    });

    const { value: showSearchResultItemDescription } = useSetting<boolean>({
        key: "appearance.showSearchResultItemDescription",
        defaultValue: true,
    });

    const { value: searchResultItemDescriptionColor } = useSetting<BadgeProps["color"]>({
        key: "appearance.searchResultItemDescriptionColor",
        defaultValue: "subtle",
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
                    scrollBehavior={scrollBehavior}
                    layout={layout}
                    styleOptions={{
                        descriptionColor: searchResultItemDescriptionColor,
                        nameTextSize: searchResultListItemNameTextSize,
                        nameTextWeight: searchResultListItemNameTextWeight,
                        detailsTextSize: searchResultListItemDetailsTextSize,
                        showDescription: showSearchResultItemDescription,
                        showIcon: showSearchResultItemIcon,
                    }}
                />
            ))}
        </div>
    );
};
