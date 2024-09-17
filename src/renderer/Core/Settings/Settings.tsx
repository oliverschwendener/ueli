import { useContextBridge } from "@Core/Hooks";
import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router";
import { ExtensionSettings } from "./ExtensionSettings";
import { Navigation } from "./Navigation";
import { settingsPages } from "./Pages";
import { SettingsHeader } from "./SettingsHeader";

export const Settings = () => {
    const { contextBridge } = useContextBridge();
    const navigate = useNavigate();
    const closeSettings = () => {
        navigate({ pathname: "/" });
        const size = contextBridge.getSettingValue("window.defaultWindowSize", { width: 600, height: 400 });

        contextBridge.ipcRenderer.send("resizeWindow", {
            center: true,
            width: size.width,
            height: size.height,
        });
    };

    useEffect(() => {
        const size = contextBridge.getSettingValue("window.defaultSettingsWindowSize", { width: 800, height: 600 });

        contextBridge.ipcRenderer.send("resizeWindow", {
            center: true,
            width: size.width,
            height: size.height,
        });
    }, []);

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={{ flexShrink: 0 }}>
                <SettingsHeader onCloseSettingsClicked={closeSettings} />
            </div>

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
                            enabledExtensions={contextBridge.getEnabledExtensions()}
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
                        <Route path="extension/:extensionId" element={<ExtensionSettings />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};
