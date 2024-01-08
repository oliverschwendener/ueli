import { FluentProvider } from "@fluentui/react-components";
import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router";
import { useContextBridge, useScrollBar, useSearchResultItems, useTheme } from "./Hooks";
import { useI18n } from "./I18n";
import { Search } from "./Search";
import { Settings } from "./Settings";
import { ThemeContext } from "./ThemeContext";
import { useAppCssProperties } from "./useAppCssProperties";

export const App = () => {
    const { contextBridge } = useContextBridge();
    const { theme, setTheme } = useTheme(contextBridge);
    const { searchResultItems } = useSearchResultItems(contextBridge);
    const navigate = useNavigate();
    const { appCssProperties } = useAppCssProperties();

    useI18n({ contextBridge });
    useScrollBar({ document, theme });

    useEffect(() => {
        contextBridge.onNavigateTo((pathname) => navigate({ pathname }));
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            <FluentProvider theme={theme} style={appCssProperties}>
                <Routes>
                    <Route path="/" element={<Search searchResultItems={searchResultItems} />} />
                    <Route path="/settings/*" element={<Settings />} />
                </Routes>
            </FluentProvider>
        </ThemeContext.Provider>
    );
};
