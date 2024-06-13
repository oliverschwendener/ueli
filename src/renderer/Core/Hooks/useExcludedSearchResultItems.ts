import { useEffect, useState } from "react";
import { useContextBridge } from "./useContextBridge";

export const useExcludedSearchResultItems = () => {
    const { contextBridge } = useContextBridge();

    const [excludedSearchResultItemIds, setExcludedSearchResultItemIds] = useState<string[]>(
        contextBridge.getExcludedSearchResultItemIds(),
    );

    useEffect(() => {
        const excludedSearchResultItemsUpdatedEventHandler = () =>
            setExcludedSearchResultItemIds(contextBridge.getExcludedSearchResultItemIds());

        contextBridge.ipcRenderer.on("excludedSearchResultItemsUpdated", excludedSearchResultItemsUpdatedEventHandler);

        return () => {
            contextBridge.ipcRenderer.off(
                "excludedSearchResultItemsUpdated",
                excludedSearchResultItemsUpdatedEventHandler,
            );
        };
    }, []);

    return { excludedSearchResultItemIds };
};
