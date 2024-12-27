import { useScrollBar } from "@Core/Hooks";
import { useI18n } from "@Core/I18n";
import { ThemeContext } from "@Core/Theme/ThemeContext";
import { FluentProvider } from "@fluentui/react-components";
import type { IpcRendererEvent } from "electron";
import { useContext, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router";
import { ExtensionSettings } from "./ExtensionSettings";
import { Navigation } from "./Navigation";
import { settingsPages } from "./Pages";

export const Settings = () => {
    const { theme } = useContext(ThemeContext);

    useI18n();
    useScrollBar({ document, theme });

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
        <FluentProvider theme={theme} style={{ minHeight: "100vh" }}>
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <div
                    style={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "row",
                        boxSizing: "border-box",
                        height: "100%",
                        width: "100%",
                        overflow: "hidden",
                    }}
                >
                    <div style={{ display: "flex", flexShrink: 0 }}>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                padding: 10,
                                gap: 20,
                                boxSizing: "border-box",
                                overflowX: "auto",
                                overflowY: "auto",
                            }}
                        >
                            <Navigation
                                settingsPages={settingsPages}
                                enabledExtensions={window.ContextBridge.getEnabledExtensions()}
                            />
                        </div>
                    </div>
                    <div
                        style={{
                            height: "100%",
                            flexGrow: 1,
                            overflowY: "auto",
                            padding: 20,
                            boxSizing: "border-box",
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
                            <Route path="/extension/:extensionId" element={<ExtensionSettings />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </FluentProvider>
    );
};
