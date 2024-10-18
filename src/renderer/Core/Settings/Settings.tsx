import { useContextBridge } from "@Core/Hooks";
import type { KeyboardEvent } from "react";
import { Route, Routes, useNavigate } from "react-router";
import { ExtensionSettings } from "./ExtensionSettings";
import { Navigation } from "./Navigation";
import { settingsPages } from "./Pages";
import { SettingsHeader } from "./SettingsHeader";

export const Settings = () => {
    const { contextBridge } = useContextBridge();
    const navigate = useNavigate();
    const closeSettings = () => navigate({ pathname: "/" });

    const handleKeyDownEvent = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            event.preventDefault();
            closeSettings();
        }
    };

    return (
        <div
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
            onKeyDown={handleKeyDownEvent}
            tabIndex={-1}
        >
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
