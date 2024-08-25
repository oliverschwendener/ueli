import fuzzysort from "fuzzysort";
import type { InternalSearchFilter } from "./InternalSearchFilter";

/**
 * Internal search filter using the fuzzysort library.
 */
export const fuzzySortFilter: InternalSearchFilter = ({
    fuzziness,
    maxSearchResultItems,
    searchResultItems,
    searchTerm,
}) => {
    // We need to invert the fuzziness value when using fuzzysort, as here a lower fuzziness value means a more
    // strict search
    const threshold = Math.round((1 - fuzziness) * 10) / 10;

    return fuzzysort
        .go(searchTerm, searchResultItems, {
            threshold,
            limit: maxSearchResultItems,
            key: "name",
        })
        .map((item) => item.obj);
};
