import { RescanSate } from "@common/RescanState";
import { SearchResultItem } from "@common/SearchResultItem";
import { FluentProvider, Theme } from "@fluentui/react-components";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router";
import { Search } from "./Search";
import { Settings } from "./Settings";
import { ThemeContext } from "./ThemeContext";
import { getThemeName, themeMap } from "./helpers";

export const App = () => {
    const [rescanState, setRescanState] = useState<RescanSate>(window.ContextBridge.getRescanState());

    const [searchResultItems, setSearchResultItems] = useState<SearchResultItem[]>(
        window.ContextBridge.getSearchResultItems(),
    );

    const [theme, setTheme] = useState<Theme>(themeMap[getThemeName()]);

    useEffect(() => {
        window.ContextBridge.onNativeThemeChanged(() => setTheme(themeMap[getThemeName()]));
        window.ContextBridge.onRescanStateChanged((rescanState) => setRescanState(rescanState));

        window.ContextBridge.onSearchIndexUpdated(() =>
            setSearchResultItems(window.ContextBridge.getSearchResultItems()),
        );
    }, []);

    return (
        <ThemeContext.Provider value={{ theme }}>
            <FluentProvider theme={theme} style={{ height: "100vh", background: "transparent" }}>
                <Routes>
                    <Route
                        path="/"
                        element={<Search rescanState={rescanState} searchResultItems={searchResultItems} />}
                    />
                    <Route path="/settings/*" element={<Settings />} />
                </Routes>
            </FluentProvider>
        </ThemeContext.Provider>
    );
};
