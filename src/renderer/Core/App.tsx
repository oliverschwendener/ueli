import { FluentProvider } from "@fluentui/react-components";
import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router";
import { Extension } from "./Extension";
import {
    useContextBridge,
    useExcludedSearchResultItems,
    useFavorites,
    useScrollBar,
    useSearchResultItems,
    useTheme,
} from "./Hooks";
import { useI18n } from "./I18n";
import { Search } from "./Search";
import { Settings } from "./Settings";
import { ThemeContext } from "./ThemeContext";
import { useAppCssProperties } from "./useAppCssProperties";

export const App = () => {
    const { contextBridge } = useContextBridge();
    const { theme, setTheme } = useTheme();
    const { searchResultItems } = useSearchResultItems();
    const { excludedSearchResultItems } = useExcludedSearchResultItems();
    const { favorites } = useFavorites();

    const navigate = useNavigate();
    const { appCssProperties } = useAppCssProperties();

    useI18n({ contextBridge });
    useScrollBar({ document, theme });

    useEffect(() => {
        contextBridge.ipcRenderer.on("navigateTo", (_, { pathname }: { pathname: string }) => navigate({ pathname }));
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
                                excludedSearchResultItems={excludedSearchResultItems}
                                favorites={favorites}
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
