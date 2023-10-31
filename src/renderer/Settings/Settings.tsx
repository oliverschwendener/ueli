import { Divider } from "@fluentui/react-components";
import { useContext, useState } from "react";
import { Route, Routes, useNavigate } from "react-router";
import { ThemeContext } from "../ThemeContext";
import { Header } from "./Header";
import { Navigation } from "./Navigation";
import { settingsPages } from "./Pages";

export const Settings = () => {
    const { theme } = useContext(ThemeContext);
    const navigate = useNavigate();

    const [path, setPath] = useState<string>(settingsPages[0].absolutePath);

    const closeSettings = () => navigate({ pathname: "/" });

    const navigateTo = (pathname: string) => {
        setPath(pathname);
        navigate({ pathname });
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={{ flexShrink: 0 }}>
                <Header onCloseSettingsClicked={closeSettings} />
                <Divider />
            </div>

            <div
                style={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "row",
                    boxSizing: "border-box",
                }}
            >
                <div style={{ flexShrink: 0, width: 200, padding: 10 }}>
                    <Navigation settingsPages={settingsPages} onNavigate={navigateTo} path={path} />
                </div>
                <div
                    style={{
                        height: "100%",
                        flexGrow: 1,
                        overflowY: "scroll",
                        padding: 20,
                        boxSizing: "border-box",
                        backgroundColor: theme.colorNeutralBackground2,
                    }}
                >
                    <Routes>
                        {settingsPages.map(({ element, relativePath }) => (
                            <Route
                                key={`settings-page-content-${relativePath}`}
                                path={relativePath}
                                element={element}
                            />
                        ))}
                    </Routes>
                </div>
            </div>
        </div>
    );
};
