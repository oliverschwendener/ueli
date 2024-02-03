import type { SearchResultItem } from "@common/Core";
import { useEffect, useState } from "react";
import { useContextBridge } from "./useContextBridge";

export const useFavorites = () => {
    const { contextBridge } = useContextBridge();

    const [favorites, setFavorites] = useState<SearchResultItem[]>(contextBridge.getFavorites());

    useEffect(() => {
        contextBridge.ipcRenderer.on("favoritesUpdated", () => {
            setFavorites(contextBridge.getFavorites());
        });
    }, []);

    return { favorites };
};
