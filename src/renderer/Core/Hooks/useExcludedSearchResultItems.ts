import type { ContextBridge, ExcludedSearchResultItem } from "@common/Core";
import { useEffect, useState } from "react";

export const useExcludedSearchResultItems = (contextBridge: ContextBridge) => {
    const [excludedSearchResultItems, setExcludedSearchResultItems] = useState<ExcludedSearchResultItem[]>(
        contextBridge.getExcludedSearchResultItems(),
    );

    useEffect(() => {
        contextBridge.ipcRenderer.on("excludedSearchResultItemsUpdated", () => {
            setExcludedSearchResultItems(contextBridge.getExcludedSearchResultItems());
        });
    }, []);

    return { excludedSearchResultItems };
};
