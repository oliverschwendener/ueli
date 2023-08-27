import { SearchResultItem } from "@common/SearchResultItem";
import { useEffect, useState } from "react";

export const useSearchResultItems = () => {
    const [searchResultItems, setSearchResultItems] = useState<SearchResultItem[]>(
        window.ContextBridge.getSearchResultItems(),
    );

    useEffect(() => {
        window.ContextBridge.onSearchIndexUpdated(() => {
            setSearchResultItems(window.ContextBridge.getSearchResultItems());
            console.log("updated");
        });
    }, []);

    return { searchResultItems };
};
