import type { SearchResultItem } from "@common/Core";
import { useEffect, useState } from "react";
import { useContextBridge } from "./useContextBridge";

export const useSearchResultItems = () => {
    const { contextBridge } = useContextBridge();

    const [searchResultItems, setSearchResultItems] = useState<SearchResultItem[]>(
        contextBridge.getSearchResultItems(),
    );

    useEffect(() => {
        const searchIndexUpdatedEventHandler = () => setSearchResultItems(contextBridge.getSearchResultItems());

        contextBridge.ipcRenderer.on("searchIndexUpdated", searchIndexUpdatedEventHandler);

        return () => {
            contextBridge.ipcRenderer.off("searchIndexUpdated", searchIndexUpdatedEventHandler);
        };
    }, []);

    return { searchResultItems };
};
