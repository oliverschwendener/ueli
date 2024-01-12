import { Field } from "@fluentui/react-components";
import { useContextBridge, useTheme } from "../../Hooks";

export const Debug = () => {
    const { contextBridge } = useContextBridge();
    const { theme } = useTheme(contextBridge);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 5, height: "100%" }}>
            <Field label="Logs">
                <textarea
                    style={{
                        height: "100%",
                        width: "100%",
                        fontFamily: theme.fontFamilyMonospace,
                        fontSize: theme.fontSizeBase200,
                        resize: "none",
                    }}
                    readOnly
                    value={contextBridge.getLogs().join("\n")}
                />
            </Field>
        </div>
    );
};
