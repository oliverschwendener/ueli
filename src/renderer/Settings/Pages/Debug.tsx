import { useContextBridge, useTheme } from "../../Hooks";

export const Debug = () => {
    const { contextBridge } = useContextBridge();
    const { theme } = useTheme(contextBridge);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 5, height: "100%" }}>
            <label htmlFor="logs">Logs</label>
            <textarea
                id="logs"
                readOnly
                value={contextBridge.getLogs().join("\n\n")}
                style={{
                    height: "100%",
                    width: "100%",
                    fontFamily: theme.fontFamilyMonospace,
                    fontSize: theme.fontSizeBase200,
                    resize: "none",
                }}
            />
        </div>
    );
};
