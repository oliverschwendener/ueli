import { useScrollBar } from "@Core/Hooks";
import { useI18n } from "@Core/I18n";
import { getTheme } from "@Core/Theme";
import { FluentProvider, type Theme } from "@fluentui/react-components";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router";
import { ExtensionSettings } from "./ExtensionSettings";
import { Navigation } from "./Navigation";
import { settingsPages } from "./Pages";

export const Settings = () => {
    const [theme, setTheme] = useState<Theme>(getTheme(window.ContextBridge));

    useI18n();
    useScrollBar({ document, theme });

    useEffect(() => {
        const nativeThemeChangedEventHandler = () => {
            console.log("setting theme");
            setTheme(getTheme(window.ContextBridge));
        };

        window.ContextBridge.ipcRenderer.on("nativeThemeChanged", nativeThemeChangedEventHandler);

        return () => {
            window.ContextBridge.ipcRenderer.off("nativeThemeChanged", nativeThemeChangedEventHandler);
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
