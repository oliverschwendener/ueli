import { tokens } from "@fluentui/react-components";
import { useEffect, useState } from "react";

export const Logs = () => {
    const [logs, setLogs] = useState<string[]>(window.ContextBridge.getLogs());

    useEffect(() => {
        const logsUpdatedEventHandler = () => setLogs(window.ContextBridge.getLogs());

        window.ContextBridge.ipcRenderer.on("logsUpdated", logsUpdatedEventHandler);

        return () => {
            window.ContextBridge.ipcRenderer.off("logsUpdated", logsUpdatedEventHandler);
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
                fontFamily: tokens.fontFamilyMonospace,
                fontSize: tokens.fontSizeBase200,
                resize: "vertical",
                background: tokens.colorNeutralBackground1,
                color: tokens.colorNeutralForeground1,
                borderRadius: tokens.borderRadiusMedium,
                padding: 10,
                boxSizing: "border-box",
            }}
        />
    );
};
