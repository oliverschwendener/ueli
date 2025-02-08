import type { SearchResultItem } from "@common/Core";
import { Text, tokens } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { SearchResultItemImage } from "./SearchResultItemImage";

type CompactSearchResultListItemProps = {
    isSelected: boolean;
    searchResultItem: SearchResultItem;
};

export const CompactSearchResultListItem = ({ isSelected, searchResultItem }: CompactSearchResultListItemProps) => {
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
            <div
                style={{
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    backgroundColor: isSelected ? tokens.colorBrandForeground1 : "transparent",
                    height: "45%",
                    width: 3,
                    transform: "translateY(-50%)",
                    borderRadius: tokens.borderRadiusLarge,
                }}
            ></div>
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
