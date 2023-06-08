import { FluentProvider, Theme, webDarkTheme, webLightTheme } from "@fluentui/react-components";
import { FC, useEffect, useState } from "react";
import { Routes } from "react-router";
import { Search } from "./Search";
import { Settings } from "./Settings";
import { Route } from "react-router";

export const App: FC = () => {
    const getTheme = (): Theme => (window.ContextBridge.themeShouldUseDarkColors() ? webDarkTheme : webLightTheme);

    const [theme, setTheme] = useState<Theme>(getTheme);

    useEffect(() => {
        window.ContextBridge.onNativeThemeChanged(() => setTheme(getTheme()));
    }, []);

    return (
        <FluentProvider theme={theme} style={{ height: "100vh", background: "transparent" }}>
            <Routes>
                <Route path="/" element={<Search />} />
                <Route path="/settings/*" element={<Settings />} />
            </Routes>
        </FluentProvider>
    );
};
