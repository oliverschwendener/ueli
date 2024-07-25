import { useContextBridge } from "@Core/Hooks";
import { Textarea } from "@fluentui/react-components";
import { useEffect, useState } from "react";
import { EncodingType, InvocationArgument } from "../../../main/Extensions/Base64Conversion/Types";

type ConverterProps = {
    setConvertedText: (text: string) => void;
    encodePlaceholder: string;
    decodePlaceholder: string;
};

export const Converter = ({ setConvertedText, encodePlaceholder, decodePlaceholder }: ConverterProps) => {
    const extensionId = "Base64Conversion";
    const { contextBridge } = useContextBridge();
    const [input, setInput] = useState({ value: "", type: EncodingType.Encode });
    const [conversionResult, setConversionResult] = useState("");

    const convertText = async (invocationString: string, encodingType: EncodingType) => {
        try {
            return await contextBridge.invokeExtension<InvocationArgument, string>(extensionId, {
                invocationString,
                encodingType,
            });
        } catch (error) {
            return "";
        }
    };

    useEffect(() => {
        const performConversion = async () => {
            const result = await convertText(input.value, input.type);
            setConversionResult(result);
            setConvertedText(result);
        };

        setTimeout(async () => {
            if (input.value) {
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
                        value={input.type === EncodingType.Decode ? conversionResult : input.value}
                        onChange={(_, { value }) => setInput({ value, type: EncodingType.Encode })}
                    />
                </div>

                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
                    <Textarea
                        style={{ flexGrow: 1, width: "100%", height: "100%" }}
                        placeholder={decodePlaceholder}
                        value={input.type === EncodingType.Encode ? conversionResult : input.value}
                        onChange={(_, { value }) => setInput({ value, type: EncodingType.Decode })}
                    />
                </div>
            </div>
        </div>
    );
};
