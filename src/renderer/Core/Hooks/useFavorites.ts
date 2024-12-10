import { useEffect, useState } from "react";

export const useFavorites = () => {
    const [favorites, setFavorites] = useState<string[]>(window.ContextBridge.getFavorites());

    useEffect(() => {
        const favoritesUpdatedEventHandler = () => setFavorites(window.ContextBridge.getFavorites());

        window.ContextBridge.ipcRenderer.on("favoritesUpdated", favoritesUpdatedEventHandler);

        return () => {
            window.ContextBridge.ipcRenderer.off("favoritesUpdated", favoritesUpdatedEventHandler);
        };
    }, []);

    return { favorites };
};
