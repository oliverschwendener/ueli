import type { SearchResultItem } from "@common/Core";
import { useEffect, useState } from "react";
import { useContextBridge } from "./useContextBridge";

export const useSearchResultItems = () => {
    const { contextBridge } = useContextBridge();

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
