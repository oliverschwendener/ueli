import type { SearchResultItem } from "@common/Core";
import { tokens } from "@fluentui/react-components";
import { useEffect, useRef, useState, type ReactElement, type RefObject } from "react";
import { CompactSearchResultListItem } from "./CompactSearchResultListItem";
import { DetailedSearchResultListItem } from "./DetailedSearchResultItem";
import { elementIsVisible } from "./Helpers";
import { SearchResultListItemSelectedIndicator } from "./SearchResultListItemSelectedIndicator";
import type { SearchResultListItemStyleOptions } from "./SearchResultListItemStyleOptions";
import type { SearchResultListLayout } from "./SearchResultListLayout";

type SearchResultListItemProps = {
    containerRef: RefObject<HTMLDivElement>;
    isSelected: boolean;
    onClick: () => void;
    onDoubleClick: () => void;
    searchResultItem: SearchResultItem;
    scrollBehavior: ScrollBehavior;
    layout: SearchResultListLayout;
    styleOptions: SearchResultListItemStyleOptions;
};

export const SearchResultListItem = ({
    containerRef,
    isSelected,
    onClick,
    onDoubleClick,
    searchResultItem,
    scrollBehavior,
    layout,
    styleOptions,
}: SearchResultListItemProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState<boolean>(false);

    const scrollIntoViewIfSelectedAndNotVisible = () => {
        if (containerRef.current && ref.current && isSelected && !elementIsVisible(ref.current, containerRef.current)) {
            ref.current?.scrollIntoView({ behavior: scrollBehavior, block: "nearest" });
        }
    };

    const selectedBackgroundColor = tokens.colorNeutralBackground1Selected;
    const hoveredBackgroundColor = tokens.colorNeutralBackground1Hover;

    useEffect(() => {
        scrollIntoViewIfSelectedAndNotVisible();
    }, [isSelected]);

    const searchResultItemComponent: Record<SearchResultListLayout, () => ReactElement> = {
        compact: () => <CompactSearchResultListItem searchResultItem={searchResultItem} styleOptions={styleOptions} />,
        detailed: () => (
            <DetailedSearchResultListItem searchResultItem={searchResultItem} styleOptions={styleOptions} />
        ),
    };

    return (
        <div
            ref={ref}
            key={searchResultItem.id}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                position: "relative",
                backgroundColor: isSelected ? selectedBackgroundColor : isHovered ? hoveredBackgroundColor : undefined,
                color: isSelected ? tokens.colorNeutralForeground1Selected : undefined,
                userSelect: "none",
                borderRadius: tokens.borderRadiusMedium,
                cursor: "pointer",
            }}
        >
            {isSelected && <SearchResultListItemSelectedIndicator />}
            {searchResultItemComponent[layout]()}
        </div>
    );
};
