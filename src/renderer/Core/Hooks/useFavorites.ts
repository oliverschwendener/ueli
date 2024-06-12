import { useEffect, useState } from "react";
import { useContextBridge } from "./useContextBridge";

export const useFavorites = () => {
    const { contextBridge } = useContextBridge();

    const [favorites, setFavorites] = useState<string[]>(contextBridge.getFavorites());

    useEffect(() => {
        const favoritesUpdatedEventHandler = () => setFavorites(contextBridge.getFavorites());

        contextBridge.ipcRenderer.on("favoritesUpdated", favoritesUpdatedEventHandler);

        return () => {
            contextBridge.ipcRenderer.off("favoritesUpdated", favoritesUpdatedEventHandler);
        };
    }, []);

    return { favorites };
};
