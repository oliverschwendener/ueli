import { useEffect, useState } from "react";

export const useExcludedSearchResultItems = () => {
    const [excludedSearchResultItemIds, setExcludedSearchResultItemIds] = useState<string[]>(
        window.ContextBridge.getExcludedSearchResultItemIds(),
    );

    useEffect(() => {
        const excludedSearchResultItemsUpdatedEventHandler = () =>
            setExcludedSearchResultItemIds(window.ContextBridge.getExcludedSearchResultItemIds());

        window.ContextBridge.ipcRenderer.on(
            "excludedSearchResultItemsUpdated",
            excludedSearchResultItemsUpdatedEventHandler,
        );

        return () => {
            window.ContextBridge.ipcRenderer.off(
                "excludedSearchResultItemsUpdated",
                excludedSearchResultItemsUpdatedEventHandler,
            );
        };
    }, []);

    return { excludedSearchResultItemIds };
};
