import { SearchResultItem } from "@common/SearchResultItem";
import { FluentProvider, Theme, webDarkTheme, webLightTheme } from "@fluentui/react-components";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router";
import { Search } from "./Search";
import { Settings } from "./Settings";

export const App = () => {
    const [searchResultItems, setSearchResultItems] = useState<SearchResultItem[]>(
        window.ContextBridge.getSearchResultItems(),
    );

    const getTheme = (): Theme => (window.ContextBridge.themeShouldUseDarkColors() ? webDarkTheme : webLightTheme);
    const [theme, setTheme] = useState<Theme>(getTheme());

    useEffect(() => {
        window.ContextBridge.onNativeThemeChanged(() => setTheme(getTheme()));

        window.ContextBridge.onSearchIndexUpdated(() =>
            setSearchResultItems(window.ContextBridge.getSearchResultItems()),
        );
    }, []);

    return (
        <FluentProvider theme={theme} style={{ height: "100vh", background: "transparent" }}>
            <Routes>
                <Route path="/" element={<Search searchResultItems={searchResultItems} />} />
                <Route path="/settings/*" element={<Settings />} />
            </Routes>
        </FluentProvider>
    );
};
