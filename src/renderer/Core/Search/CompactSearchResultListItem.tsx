import type { SearchResultItem } from "@common/Core";
import { Text } from "@fluentui/react-components";
import { SearchResultItemDescriptionBadge } from "./SearchResultItemDescriptionBadge";
import { SearchResultItemImage } from "./SearchResultItemImage";
import type { SearchResultListItemStyleOptions } from "./SearchResultListItemStyleOptions";

type CompactSearchResultListItemProps = {
    searchResultItem: SearchResultItem;
    styleOptions: SearchResultListItemStyleOptions;
};

export const CompactSearchResultListItem = ({ searchResultItem, styleOptions }: CompactSearchResultListItemProps) => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 8,
                boxSizing: "border-box",
                gap: 8,
                width: "100%",
            }}
        >
            {styleOptions.showIcon && (
                <div style={{ flexShrink: 0, marginLeft: 2 }}>
                    <SearchResultItemImage image={searchResultItem.image} altText={searchResultItem.name} size={20} />
                </div>
            )}

            <Text
                size={styleOptions.nameTextSize}
                weight={styleOptions.nameTextWeight}
                style={{
                    flexGrow: 1,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }}
            >
                {searchResultItem.name}
            </Text>
            {styleOptions.showDescription && (
                <div style={{ flexShrink: 0, display: "flex" }}>
                    <SearchResultItemDescriptionBadge
                        color={styleOptions.descriptionColor}
                        searchResultItem={searchResultItem}
                    />
                </div>
            )}
        </div>
    );
};
