import type { SearchResultItem } from "@common/Core";
import { Badge, type BadgeProps } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

type SearchResultItemDescriptionBadgeProps = {
    color: BadgeProps["color"];
    searchResultItem: SearchResultItem;
};

export const SearchResultItemDescriptionBadge = ({
    color,
    searchResultItem,
}: SearchResultItemDescriptionBadgeProps) => {
    const { t } = useTranslation();

    return (
        <Badge color={color} size="small">
            {searchResultItem.descriptionTranslation
                ? t(searchResultItem.descriptionTranslation.key, {
                      ns: searchResultItem.descriptionTranslation.namespace,
                  })
                : searchResultItem.description}
        </Badge>
    );
};
