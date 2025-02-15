import type { SearchResultItem } from "@common/Core";
import type { RefObject } from "react";
import { useSetting } from "../Hooks";
import { SearchResultListItem } from "./SearchResultListItem";
import type { SearchResultListLayout } from "./SearchResultListLayout";

type SearchResultListProps = {
    containerRef: RefObject<HTMLDivElement>;
    selectedItemId: string;
    searchResultItems: SearchResultItem[];
    onSearchResultItemClick: (searchResultItem: SearchResultItem) => void;
    onSearchResultItemDoubleClick: (searchResultItem: SearchResultItem) => void;
    layout: SearchResultListLayout;
};

export const SearchResultList = ({
    containerRef,
    selectedItemId,
    searchResultItems,
    onSearchResultItemClick,
    onSearchResultItemDoubleClick,
    layout,
}: SearchResultListProps) => {
    const { value: scrollBehavior } = useSetting<ScrollBehavior>({
        key: "window.scrollBehavior",
        defaultValue: "smooth",
    });

    const { value: dragAndDropEnabled } = useSetting<boolean>({
        key: "keyboardAndMouse.dragAndDropEnabled",
        defaultValue: false,
    });

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: 5,
            }}
        >
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
                    dragAndDropEnabled={dragAndDropEnabled}
                />
            ))}
        </div>
    );
};
