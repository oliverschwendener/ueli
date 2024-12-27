import { FluentProvider } from "@fluentui/react-components";
import type { IpcRendererEvent } from "electron";
import { useContext, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router";
import { Extension } from "./Extension";
import { useExcludedSearchResultItems, useFavorites, useScrollBar, useSearchResultItems, useSetting } from "./Hooks";
import { useI18n } from "./I18n";
import { Search } from "./Search";
import { ThemeContext } from "./Theme/ThemeContext";
import { getAppCssProperties } from "./getAppCssProperties";

export const App = () => {
    const { fluentUiTheme, shouldUseDarkColors } = useContext(ThemeContext);
    const { searchResultItems } = useSearchResultItems();
    const { excludedSearchResultItemIds } = useExcludedSearchResultItems();
    const { favorites } = useFavorites();

    const { value: backgroundMaterial } = useSetting({ key: "window.backgroundMaterial", defaultValue: "Mica" });
    const { value: acrylicOpacity } = useSetting({ key: "window.acrylicOpacity", defaultValue: 0.6 });
    const { value: vibrancy } = useSetting({ key: "window.vibrancy", defaultValue: "None" });

    const { appCssProperties } = getAppCssProperties({
        shouldUseDarkColors,
        acrylicOpacity,
        backgroundMaterial,
        vibrancy,
    });

    useI18n();
    useScrollBar({ document });

    const navigate = useNavigate();

    useEffect(() => {
        const navigateToEventHandler = (_: IpcRendererEvent, { pathname }: { pathname: string }) => {
            navigate({ pathname });
        };

        window.ContextBridge.ipcRenderer.on("navigateTo", navigateToEventHandler);

        return () => {
            window.ContextBridge.ipcRenderer.off("navigateTo", navigateToEventHandler);
        };
    }, []);

    return (
        <FluentProvider theme={fluentUiTheme} style={appCssProperties}>
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
                <Route path="/extension/:extensionId" element={<Extension />} />
            </Routes>
        </FluentProvider>
    );
};
