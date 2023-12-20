import { FluentProvider } from "@fluentui/react-components";
import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router";
import { useContextBridge, useScrollBar, useSearchResultItems, useTheme } from "./Hooks";
import { useI18n } from "./I18n";
import { Search } from "./Search";
import { Settings } from "./Settings";
import { ThemeContext } from "./ThemeContext";
import { getGlobalCssProperties } from "./globalCssProperties";

export const App = () => {
    const { contextBridge } = useContextBridge();
    const { theme, setTheme } = useTheme(contextBridge);
    const { searchResultItems } = useSearchResultItems(contextBridge);
    const navigate = useNavigate();

    useI18n({ contextBridge });
    useScrollBar({ document, theme });

    useEffect(() => {
        contextBridge.onOpenSettings(() => navigate({ pathname: "/settings/general" }));
        contextBridge.onOpenAbout(() => navigate({ pathname: "/settings/about" }));
    }, []);

    const shouldUseDarkColors = contextBridge.themeShouldUseDarkColors();
    const operatingSystem = contextBridge.getOperatingSystem();

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            <FluentProvider theme={theme} style={getGlobalCssProperties(shouldUseDarkColors)[operatingSystem]}>
                <Routes>
                    <Route path="/" element={<Search searchResultItems={searchResultItems} />} />
                    <Route path="/settings/*" element={<Settings />} />
                </Routes>
            </FluentProvider>
        </ThemeContext.Provider>
    );
};
