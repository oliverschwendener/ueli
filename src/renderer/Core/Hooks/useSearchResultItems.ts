import type { ContextBridge, SearchResultItem } from "@common/Core";
import { useEffect, useState } from "react";

export const useSearchResultItems = (contextBridge: ContextBridge) => {
    const [searchResultItems, setSearchResultItems] = useState<SearchResultItem[]>(
        contextBridge.getSearchResultItems(),
    );

    useEffect(() => {
        contextBridge.ipcRenderer.on("searchIndexUpdated", () => {
            setSearchResultItems(contextBridge.getSearchResultItems());
        });
    }, []);

    return { searchResultItems };
};
