import type { InvocationArgument } from "@common/Extensions/Base64Conversion";
import { useContextBridge } from "@Core/Hooks";
import { Textarea } from "@fluentui/react-components";
import { useEffect, useState } from "react";

type ConverterProps = {
    setConvertedText: (text: string) => void;
    encodePlaceholder: string;
    decodePlaceholder: string;
};

export const Converter = ({ setConvertedText, encodePlaceholder, decodePlaceholder }: ConverterProps) => {
    const extensionId = "Base64Conversion";
    const { contextBridge } = useContextBridge();
    const [input, setInput] = useState<InvocationArgument>({ payload: "", action: "encode" });
    const [conversionResult, setConversionResult] = useState("");

    const convertText = async (payload: string, action: "encode" | "decode") => {
        try {
            return await contextBridge.invokeExtension<InvocationArgument, string>(extensionId, {
                payload,
                action,
            });
        } catch (error) {
            return "";
        }
    };

    useEffect(() => {
        const performConversion = async () => {
            const result = await convertText(input.payload, input.action);
            setConversionResult(result);
            setConvertedText(result);
        };

        setTimeout(async () => {
            if (input.payload) {
                performConversion();
            }
        }, 250);
    }, [input]);

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
            <div style={{ display: "flex", flexDirection: "row", gap: 10, flexGrow: 1 }}>
                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
                    <Textarea
                        autoFocus
                        style={{ flexGrow: 1, width: "100%", height: "100%" }}
                        placeholder={encodePlaceholder}
                        value={input.action === "decode" ? conversionResult : input.payload}
                        onChange={(_, { value }) => setInput({ payload: value, action: "encode" })}
                    />
                </div>

                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
                    <Textarea
                        style={{ flexGrow: 1, width: "100%", height: "100%" }}
                        placeholder={decodePlaceholder}
                        value={input.action === "encode" ? conversionResult : input.payload}
                        onChange={(_, { value }) => setInput({ payload: value, action: "decode" })}
                    />
                </div>
            </div>
        </div>
    );
};
