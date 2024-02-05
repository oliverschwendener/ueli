import { useEffect, useState } from "react";
import { useContextBridge } from "./useContextBridge";

export const useExcludedSearchResultItems = () => {
    const { contextBridge } = useContextBridge();

    const [excludedSearchResultItemIds, setExcludedSearchResultItemIds] = useState<string[]>(
        contextBridge.getExcludedSearchResultItemIds(),
    );

    useEffect(() => {
        contextBridge.ipcRenderer.on("excludedSearchResultItemsUpdated", () => {
            setExcludedSearchResultItemIds(contextBridge.getExcludedSearchResultItemIds());
        });
    }, []);

    return { excludedSearchResultItemIds };
};
