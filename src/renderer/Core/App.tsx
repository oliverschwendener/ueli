import type { Theme } from "@fluentui/react-components";
import { FluentProvider } from "@fluentui/react-components";
import type { IpcRendererEvent } from "electron";
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
    const [shouldPreferDarkColors, setShouldPreferDarkColors] = useState<boolean>(
        window.matchMedia("(prefers-color-scheme: dark)").matches,
    );
    const { searchResultItems } = useSearchResultItems();
    const { excludedSearchResultItemIds } = useExcludedSearchResultItems();
    const { favorites } = useFavorites();

    const navigate = useNavigate();
    const { appCssProperties } = useAppCssProperties();

    useI18n({ contextBridge });
    useScrollBar({ document, theme });

    const setThemeBackgroundColor = (theme: Theme) => {
        const rootNode = document.querySelector("html");
        if (rootNode) {
            rootNode.style.backgroundColor = theme.colorNeutralBackground1;
        }
    };

    useEffect(() => {
        setThemeBackgroundColor(theme);
        const navigateToEventHandler = (_: IpcRendererEvent, { pathname }: { pathname: string }) => {
            console.log(pathname);

            navigate({ pathname });
        };

        const nativeThemeChangedEventHandler = () => {
            const theme = getTheme(contextBridge);
            setThemeBackgroundColor(theme);
            setShouldPreferDarkColors(window.matchMedia("(prefers-color-scheme: dark)").matches);
        };

        contextBridge.ipcRenderer.on("navigateTo", navigateToEventHandler);
        contextBridge.ipcRenderer.on("nativeThemeChanged", nativeThemeChangedEventHandler);

        return () => {
            contextBridge.ipcRenderer.off("navigateTo", navigateToEventHandler);
            contextBridge.ipcRenderer.off("nativeThemeChanged", nativeThemeChangedEventHandler);
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
                    <Route path="/settings/*" element={<Settings />} />
                    <Route path="/extension/:extensionId" element={<Extension />} />
                </Routes>
            </FluentProvider>
        </ThemeContext.Provider>
    );
};
