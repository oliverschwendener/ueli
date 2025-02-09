import type { SearchResultItem } from "@common/Core";
import { Text } from "@fluentui/react-components";
import { SearchResultItemDescriptionBadge } from "./SearchResultItemDescriptionBadge";
import { SearchResultItemImage } from "./SearchResultItemImage";
import type { SearchResultListItemStyleOptions } from "./SearchResultListItemStyleOptions";

type DetailedSearchResultListItemProps = {
    searchResultItem: SearchResultItem;
    styleOptions: SearchResultListItemStyleOptions;
};

export const DetailedSearchResultListItem = ({ searchResultItem, styleOptions }: DetailedSearchResultListItemProps) => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 10px",
                boxSizing: "border-box",
                gap: 10,
                width: "100%",
            }}
        >
            {styleOptions.showIcon && (
                <div style={{ flexShrink: 0, marginLeft: 2 }}>
                    <SearchResultItemImage image={searchResultItem.image} altText={searchResultItem.name} size={24} />
                </div>
            )}

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
                    overflow: "hidden",
                }}
            >
                <Text
                    weight={styleOptions.nameTextWeight}
                    size={styleOptions.nameTextSize}
                    style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    {searchResultItem.name}
                </Text>
                {searchResultItem.details && (
                    <Text
                        size={styleOptions.detailsTextSize}
                        style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {searchResultItem.details}
                    </Text>
                )}
            </div>
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
