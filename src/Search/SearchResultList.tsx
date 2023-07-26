import { SearchResultItem } from "@common/SearchResultItem";
import { RefObject } from "react";
import { SearchResultListItem } from "./SearchResultListItem";

type SearchResultListProps = {
    containerRef: RefObject<HTMLDivElement>;
    selectedItemIndex: number;
    searchResultItems: SearchResultItem[];
};

export const SearchResultList = ({ containerRef, selectedItemIndex, searchResultItems }: SearchResultListProps) => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
            }}
        >
            {searchResultItems.map((searchResultItem, index) => (
                <SearchResultListItem
                    containerRef={containerRef}
                    key={searchResultItem.id}
                    isSelected={selectedItemIndex === index}
                    searchResultItem={searchResultItem}
                />
            ))}
        </div>
    );
};
