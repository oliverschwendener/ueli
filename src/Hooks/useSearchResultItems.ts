import type { ContextBridge } from "@common/ContextBridge";
import type { SearchResultItem } from "@common/SearchResultItem";
import { useEffect, useState } from "react";

export const useSearchResultItems = (contextBridge: ContextBridge) => {
    const [searchResultItems, setSearchResultItems] = useState<SearchResultItem[]>(
        contextBridge.getSearchResultItems(),
    );

    useEffect(() => {
        contextBridge.onSearchIndexUpdated(() => setSearchResultItems(contextBridge.getSearchResultItems()));
    }, []);

    return { searchResultItems };
};
