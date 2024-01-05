import { useContextBridge, useTheme } from "../../Hooks";

export const Debug = () => {
    const { contextBridge } = useContextBridge();
    const { theme } = useTheme(contextBridge);

    const logs = contextBridge.getLogs();

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 5, height: "100%" }}>
            <label id="debug.logs">Logs</label>
            <textarea
                style={{
                    height: "100%",
                    width: "100%",
                    fontFamily: theme.fontFamilyMonospace,
                    fontSize: theme.fontSizeBase200,
                    resize: "none",
                }}
                readOnly
                value={logs.join("\n")}
            />
        </div>
    );
};
