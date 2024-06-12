import { useContextBridge } from "@Core/Hooks";
import { ThemeContext } from "@Core/ThemeContext";
import { useContext, useEffect, useState } from "react";

export const Logs = () => {
    const { contextBridge } = useContextBridge();
    const { theme } = useContext(ThemeContext);

    const [logs, setLogs] = useState<string[]>(contextBridge.getLogs());

    useEffect(() => {
        const logsUpdatedEventHandler = () => setLogs(contextBridge.getLogs());

        contextBridge.ipcRenderer.on("logsUpdated", logsUpdatedEventHandler);

        return () => {
            contextBridge.ipcRenderer.off("logsUpdated", logsUpdatedEventHandler);
        };
    });

    return (
        <textarea
            id="logs"
            readOnly
            value={logs.join("\n\n")}
            style={{
                height: 300,
                width: "100%",
                fontFamily: theme.fontFamilyMonospace,
                fontSize: theme.fontSizeBase200,
                resize: "vertical",
                background: theme.colorNeutralBackground1,
                color: theme.colorNeutralForeground1,
                borderRadius: theme.borderRadiusMedium,
                padding: 10,
                boxSizing: "border-box",
            }}
        />
    );
};
