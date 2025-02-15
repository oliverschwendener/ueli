import type { SearchResultItem } from "@common/Core";
import { Badge } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const SearchResultItemDescriptionBadge = ({ searchResultItem }: { searchResultItem: SearchResultItem }) => {
    const { t } = useTranslation();

    return (
        <Badge color="subtle" size="small">
            {searchResultItem.descriptionTranslation
                ? t(searchResultItem.descriptionTranslation.key, {
                      ns: searchResultItem.descriptionTranslation.namespace,
                  })
                : searchResultItem.description}
        </Badge>
    );
};
