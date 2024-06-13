import { FluentProvider, Theme } from "@fluentui/react-components";
import { IpcRendererEvent } from "electron";
import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router";
import { Extension } from "./Extension";
import {
    useContextBridge,
    useExcludedSearchResultItems,
    useFavorites,
    useScrollBar,
    useSearchResultItems,
} from "./Hooks";
import { useI18n } from "./I18n";
import { Search } from "./Search";
import { Settings } from "./Settings";
import { getTheme } from "./Theme";
import { ThemeContext } from "./ThemeContext";
import { useAppCssProperties } from "./useAppCssProperties";

export const App = () => {
    const { contextBridge } = useContextBridge();
    const [theme, setTheme] = useState<Theme>(getTheme(contextBridge));
    const { searchResultItems } = useSearchResultItems();
    const { excludedSearchResultItemIds } = useExcludedSearchResultItems();
    const { favorites } = useFavorites();

    const navigate = useNavigate();
    const { appCssProperties } = useAppCssProperties();

    useI18n({ contextBridge });
    useScrollBar({ document, theme });

    useEffect(() => {
        const navigateToEventHandler = (_: IpcRendererEvent, { pathname }: { pathname: string }) =>
            navigate({ pathname });

        const nativeThemeChangedEventHandler = () => setTheme(getTheme(contextBridge));

        contextBridge.ipcRenderer.on("navigateTo", navigateToEventHandler);
        contextBridge.ipcRenderer.on("nativeThemeChanged", nativeThemeChangedEventHandler);

        return () => {
            contextBridge.ipcRenderer.off("navigateTo", navigateToEventHandler);
            contextBridge.ipcRenderer.off("nativeThemeChanged", nativeThemeChangedEventHandler);
        };
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            <FluentProvider theme={theme} style={appCssProperties}>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Search
                                searchResultItems={searchResultItems}
                                excludedSearchResultItemIds={excludedSearchResultItemIds}
                                favoriteSearchResultItemIds={favorites}
                            />
                        }
                    />
                    <Route path="/settings/*" element={<Settings />} />
                    <Route path="/extension/:extensionId" element={<Extension />} />
                </Routes>
            </FluentProvider>
        </ThemeContext.Provider>
    );
};
