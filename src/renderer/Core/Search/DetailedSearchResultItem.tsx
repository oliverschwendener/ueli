import type { SearchResultItem } from "@common/Core";
import { Badge, Text } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { SearchResultItemImage } from "./SearchResultItemImage";

type DetailedSearchResultListItemProps = {
    searchResultItem: SearchResultItem;
};

export const DetailedSearchResultListItem = ({ searchResultItem }: DetailedSearchResultListItemProps) => {
    const { t } = useTranslation();

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
            {/* The left margin makes sure that the icon has the correct space horizontally */}
            <div style={{ flexShrink: 0, marginLeft: 2 }}>
                <SearchResultItemImage image={searchResultItem.image} altText={searchResultItem.name} size={24} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, overflow: "hidden" }}>
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
                <Text
                    size={200}
                    style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    Here go the details of the search resul item
                </Text>
            </div>
            <div style={{ flexShrink: 0, display: "flex" }}>
                <Badge color="subtle" size="small">
                    {searchResultItem.descriptionTranslation
                        ? t(searchResultItem.descriptionTranslation.key, {
                              ns: searchResultItem.descriptionTranslation.namespace,
                          })
                        : searchResultItem.description}
                </Badge>
            </div>
        </div>
    );
};
