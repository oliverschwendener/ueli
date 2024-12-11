import type { Theme } from "@fluentui/react-components";
import { FluentProvider } from "@fluentui/react-components";
import type { IpcRendererEvent } from "electron";
import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router";
import { Extension } from "./Extension";
import { useExcludedSearchResultItems, useFavorites, useScrollBar, useSearchResultItems } from "./Hooks";
import { useI18n } from "./I18n";
import { Search } from "./Search";
import { getTheme } from "./Theme";
import { ThemeContext } from "./ThemeContext";
import { useAppCssProperties } from "./useAppCssProperties";

export const App = () => {
    const [theme, setTheme] = useState<Theme>(getTheme(window.ContextBridge));
    const [shouldPreferDarkColors, setShouldPreferDarkColors] = useState<boolean>(
        window.matchMedia("(prefers-color-scheme: dark)").matches,
    );
    const { searchResultItems } = useSearchResultItems();
    const { excludedSearchResultItemIds } = useExcludedSearchResultItems();
    const { favorites } = useFavorites();

    const navigate = useNavigate();
    const { appCssProperties } = useAppCssProperties();

    useI18n();
    useScrollBar({ document, theme });

    useEffect(() => {
        const navigateToEventHandler = (_: IpcRendererEvent, { pathname }: { pathname: string }) =>
            navigate({ pathname });

        const nativeThemeChangedEventHandler = () => {
            setTheme(getTheme(window.ContextBridge));
            setShouldPreferDarkColors(window.matchMedia("(prefers-color-scheme: dark)").matches);
        };

        window.ContextBridge.ipcRenderer.on("navigateTo", navigateToEventHandler);
        window.ContextBridge.ipcRenderer.on("nativeThemeChanged", nativeThemeChangedEventHandler);

        return () => {
            window.ContextBridge.ipcRenderer.off("navigateTo", navigateToEventHandler);
            window.ContextBridge.ipcRenderer.off("nativeThemeChanged", nativeThemeChangedEventHandler);
        };
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, shouldPreferDarkColors }}>
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
                    {/* <Route path="/settings/*" element={<Settings />} /> */}
                    <Route path="/extension/:extensionId" element={<Extension />} />
                </Routes>
            </FluentProvider>
        </ThemeContext.Provider>
    );
};
