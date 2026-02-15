import type { ContextBridge } from "@common/Core";
import type { InvocationArgument } from "@common/Extensions/RowlandTextEditor";
import { useExtensionSetting } from "@Core/Hooks";
import { Input, Label, ProgressBar, Textarea, tokens } from "@fluentui/react-components";
import { useEffect, useRef, useState } from "react";

type EditorProps = {
    outputText: string;
    setOutputText: (text: string) => void;
    inputPlaceholder: string;
    outputPlaceholder: string;
    patternLabel: string;
    patternPlaceholder: string;
    rowSeparatorLabel: string;
    rowSeparatorPlaceholder: string;
    columnSeparatorLabel: string;
    columnSeparatorPlaceholder: string;
    contextBridge: ContextBridge;
};

export const Editor = ({
    outputText,
    setOutputText,
    inputPlaceholder,
    outputPlaceholder,
    patternLabel,
    patternPlaceholder,
    rowSeparatorLabel,
    rowSeparatorPlaceholder,
    columnSeparatorLabel,
    columnSeparatorPlaceholder,
    contextBridge,
}: EditorProps) => {
    const extensionId = "RowlandTextEditor";

    const [inputText, setInputText] = useState<string>("");
    const [pattern, setPattern] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const { value: rowSeparator, updateValue: setRowSeparator } = useExtensionSetting<string>({
        extensionId,
        key: "rowSeparator",
    });

    const { value: columnSeparator, updateValue: setColumnSeparator } = useExtensionSetting<string>({
        extensionId,
        key: "columnSeparator",
    });

    const [clearTimeoutValue, setClearTimeoutValue] = useState<NodeJS.Timeout | undefined>(undefined);

    const apply = async () => {
        try {
            const output = await contextBridge.invokeExtension<InvocationArgument, string>(extensionId, {
                inputText,
                pattern,
                settings: {
                    rowSeparator,
                    columnSeparator,
                },
            });
            setOutputText(output);
        } catch (error) {
            setOutputText("");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setIsLoading(true);

        if (clearTimeoutValue) {
            clearTimeout(clearTimeoutValue);
        }

        setClearTimeoutValue(
            setTimeout(async () => {
                setClearTimeoutValue(undefined);
                await apply();
            }, 250),
        );
    }, [inputText, pattern, rowSeparator, columnSeparator]);

    const inputTextareaRef = useRef<HTMLTextAreaElement>(null);
    const outputTextareaRef = useRef<HTMLTextAreaElement>(null);
    useEffect(() => {
        if (inputTextareaRef.current) {
            inputTextareaRef.current.style.fontFamily = tokens.fontFamilyMonospace;
        }

        if (outputTextareaRef.current) {
            outputTextareaRef.current.style.fontFamily = tokens.fontFamilyMonospace;
        }
    }, []);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                padding: 10,
                boxSizing: "border-box",
                gap: 10,
                height: "100%",
            }}
        >
            <div style={{ display: "flex", flexDirection: "column", gap: 10, flexGrow: 1 }}>
                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10, flexGrow: 1 }}>
                    <Textarea
                        ref={inputTextareaRef}
                        autoFocus
                        style={{ flexGrow: 1, width: "100%", height: "100%" }}
                        placeholder={inputPlaceholder}
                        onChange={(_, { value }) => setInputText(value)}
                    />
                </div>

                <div style={{ display: "flex", flexDirection: "row", gap: 10, alignItems: "flex-end" }}>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                        <Label style={{ padding: 5 }}>{patternLabel}</Label>
                        <Input
                            type="text"
                            value={pattern}
                            placeholder={patternPlaceholder}
                            onChange={(_, { value }) => setPattern(value)}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", minWidth: 120 }}>
                        <Label style={{ padding: 5 }}>{rowSeparatorLabel}</Label>
                        <Input
                            type="text"
                            value={rowSeparator}
                            placeholder={rowSeparatorPlaceholder}
                            onChange={(_, { value }) => setRowSeparator(value)}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", minWidth: 120 }}>
                        <Label style={{ padding: 5 }}>{columnSeparatorLabel}</Label>
                        <Input
                            type="text"
                            placeholder={columnSeparatorPlaceholder}
                            value={columnSeparator}
                            onChange={(_, { value }) => setColumnSeparator(value)}
                        />
                    </div>
                </div>

                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10, flexGrow: 1 }}>
                    <Textarea
                        ref={outputTextareaRef}
                        style={{ flexGrow: 1, width: "100%", height: "100%" }}
                        value={outputText}
                        placeholder={outputPlaceholder}
                    />
                </div>
                <div
                    style={{
                        minHeight: 5,
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    {isLoading ? <ProgressBar /> : null}
                </div>
            </div>
        </div>
    );
};
