import { Divider } from "@fluentui/react-components";
import { FC, useState } from "react";
import { Routes, useNavigate } from "react-router";
import { Header } from "./Header";
import { Navigation } from "./Navigation";
import { Route } from "react-router";
import { settingsPages } from "./Pages";

export const Settings: FC = () => {
    const navigate = useNavigate();

    const [path, setPath] = useState<string>(settingsPages[0].absolutePath);

    const closeSettings = () => {
        navigate({ pathname: "/" });
        window.ContextBridge.settingsOpenStateChanged({ settingsOpened: false });
    };

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
                    padding: 10,
                    gap: 10,
                    boxSizing: "border-box",
                }}
            >
                <div style={{ flexShrink: 0, width: 200 }}>
                    <Navigation settingsPages={settingsPages} onNavigate={navigateTo} path={path} />
                </div>
                <div style={{ height: "100%", flexGrow: 1, overflowY: "auto", padding: 10, boxSizing: "border-box" }}>
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
