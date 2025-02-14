import type { SearchResultItem } from "@common/Core";
import { Text } from "@fluentui/react-components";
import { DragIndicator } from "./DragIndicator";
import { SearchResultItemDescriptionBadge } from "./SearchResultItemDescriptionBadge";
import { SearchResultItemImage } from "./SearchResultItemImage";

type DetailedSearchResultListItemProps = {
    searchResultItem: SearchResultItem;
};

export const DetailedSearchResultListItem = ({ searchResultItem }: DetailedSearchResultListItemProps) => {
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
            <div style={{ flexShrink: 0 }}>
                <SearchResultItemImage image={searchResultItem.image} altText={searchResultItem.name} size={24} />
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
                    overflow: "hidden",
                }}
            >
                <Text
                    weight="semibold"
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
                        size={200}
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
            <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 5 }}>
                {searchResultItem.dragAndDrop && <DragIndicator />}
                <SearchResultItemDescriptionBadge searchResultItem={searchResultItem} />
            </div>
        </div>
    );
};
