import type { Image } from "./Image";
import type { SearchResultItemAction } from "./SearchResultItemAction";

/**
 * Represents an item in the search result list.
 */
export type SearchResultItem = {
    /**
     * The unique ID of the search result item.
     */
    id: string;

    /**
     * The name of the search result item.
     */
    name: string;

    /**
     * The description of the search result item.
     */
    description: string;

    /**
     * The translation of the search result item description. If given, this will be used instead of the description.
     */
    descriptionTranslation?: { key: string; namespace: string };

    /**
     * The image of the search result item. This image will be used in the search result list.
     */
    image: Image;

    /**
     * The default action of the search result item. By default, this will be invoked when pressing enter or clicking on
     * the search result item in the search result list.
     */
    defaultAction: SearchResultItemAction;

    /**
     * Additional actions that can be invoked via the additional action menu.
     */
    additionalActions?: SearchResultItemAction[];
};
