import type { Image } from "./Image";
import type { SearchResultItemAction } from "./SearchResultItemAction";

export type SearchResultItem = {
    id: string;
    name: string;
    description: string;
    descriptionTranslation?: { key: string; namespace: string };
    image: Image;
    defaultAction: SearchResultItemAction;
    additionalActions?: SearchResultItemAction[];
};
