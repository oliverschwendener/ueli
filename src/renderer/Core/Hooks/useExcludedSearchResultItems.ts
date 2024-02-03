import type { ExcludedSearchResultItem } from "@common/Core";
import { useEffect, useState } from "react";
import { useContextBridge } from "./useContextBridge";

export const useExcludedSearchResultItems = () => {
    const { contextBridge } = useContextBridge();

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
