import { FluentProvider } from "@fluentui/react-components";
import { Route, Routes } from "react-router";
import { useScrollBar, useSearchResultItems, useTheme } from "./Hooks";
import { Search } from "./Search";
import { Settings } from "./Settings";
import { ThemeContext } from "./ThemeContext";

export const App = () => {
    const { theme, setTheme } = useTheme();
    const { searchResultItems } = useSearchResultItems();

    useScrollBar(theme);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            <FluentProvider theme={theme} style={{ height: "100vh" }}>
                <Routes>
                    <Route path="/" element={<Search searchResultItems={searchResultItems} />} />
                    <Route path="/settings/*" element={<Settings />} />
                </Routes>
            </FluentProvider>
        </ThemeContext.Provider>
    );
};
