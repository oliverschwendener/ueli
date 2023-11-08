import type { SearchResultItemAction } from "./SearchResultItemAction";

export type SearchResultItem = {
    id: string;
    name: string;
    nameTranslationKey?: string;
    description: string;
    descriptionTranslationKey?: string;
    imageUrl?: string;
    defaultAction: SearchResultItemAction;
    additionalActions?: SearchResultItemAction[];
};
