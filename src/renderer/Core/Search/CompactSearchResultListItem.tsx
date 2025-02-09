import type { SearchResultItem } from "@common/Core";
import { Badge, Text } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { SearchResultItemImage } from "./SearchResultItemImage";

type CompactSearchResultListItemProps = {
    searchResultItem: SearchResultItem;
};

export const CompactSearchResultListItem = ({ searchResultItem }: CompactSearchResultListItemProps) => {
    const { t } = useTranslation();

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 8,
                boxSizing: "border-box",
                gap: 10,
                width: "100%",
            }}
        >
            <div style={{ flexShrink: 0 }}>
                <SearchResultItemImage image={searchResultItem.image} altText={searchResultItem.name} size={20} />
            </div>
            <Text
                style={{
                    flexGrow: 1,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }}
            >
                {searchResultItem.name}
            </Text>
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
