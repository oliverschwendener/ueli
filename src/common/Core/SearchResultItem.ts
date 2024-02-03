import type { SearchResultItemAction } from "./SearchResultItemAction";

export type SearchResultItem = {
    id: string;
    name: string;
    description: string;
    descriptionTranslation?: { key: string; namespace: string };
    imageUrl: string;
    imageUrlOnDarkBackground?: string;
    imageUrlOnLightBackground?: string;
    defaultAction: SearchResultItemAction;
    additionalActions?: SearchResultItemAction[];
};
