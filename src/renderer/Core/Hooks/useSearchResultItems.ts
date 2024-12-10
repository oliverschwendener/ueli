import type { SearchResultItem } from "@common/Core";
import { useEffect, useState } from "react";

export const useSearchResultItems = () => {
    const [searchResultItems, setSearchResultItems] = useState<SearchResultItem[]>(
        window.ContextBridge.getSearchResultItems(),
    );

    useEffect(() => {
        const searchIndexUpdatedEventHandler = () => setSearchResultItems(window.ContextBridge.getSearchResultItems());

        window.ContextBridge.ipcRenderer.on("searchIndexUpdated", searchIndexUpdatedEventHandler);

        return () => {
            window.ContextBridge.ipcRenderer.off("searchIndexUpdated", searchIndexUpdatedEventHandler);
        };
    }, []);

    return { searchResultItems };
};
