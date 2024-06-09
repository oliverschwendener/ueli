import { useContextBridge, useTheme } from "@Core/Hooks";
import { useEffect, useState } from "react";

export const Logs = () => {
    const { contextBridge } = useContextBridge();
    const { theme } = useTheme();

    const [logs, setLogs] = useState<string[]>(contextBridge.getLogs());

    useEffect(() => {
        contextBridge.ipcRenderer.on("logsUpdated", () => {
            setLogs(contextBridge.getLogs());
        });
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
