import type { SearchResultItem } from "@common/Core";
import { Text } from "@fluentui/react-components";
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
                justifyContent: "flex-start",
                height: 36,
                padding: 10,
                boxSizing: "border-box",
                gap: 10,
                width: "100%",
            }}
        >
            <SearchResultItemImage image={searchResultItem.image} altText={searchResultItem.name} size={20} />
            <Text
                size={300}
                style={{
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                }}
            >
                {searchResultItem.name}
            </Text>
            <Text size={200} style={{ flexShrink: 0 }}>
                {searchResultItem.descriptionTranslation
                    ? t(searchResultItem.descriptionTranslation.key, {
                          ns: searchResultItem.descriptionTranslation.namespace,
                      })
                    : searchResultItem.description}
            </Text>
        </div>
    );
};
