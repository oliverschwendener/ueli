import { Dropdown, Option, ProgressBar, Textarea } from "@fluentui/react-components";
import { useEffect, useState } from "react";
import { sourceLanguages } from "./sourceLanguages";
import { targetLanguages } from "./targetLanguages";

type TranslatorProps = {
    translatedText: string;
    setTranslatedText: (text: string) => void;
    defaultSourceLanguage: string;
    defaultTargetLanguage: string;
};

type InvocationArgument = {
    searchTerm: string;
    sourceLanguage: string;
    targetLanguage: string;
};

type InvocationResult = string[];

export const Translator = ({
    translatedText,
    setTranslatedText,
    defaultSourceLanguage,
    defaultTargetLanguage,
}: TranslatorProps) => {
    const extensionId = "DeeplTranslator";

    const [userInput, setUserInput] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(userInput.length > 0);

    const [sourceLanguage, setSourceLanguage] = useState<string>(defaultSourceLanguage);
    const [targetLanguage, setTargetLanguage] = useState<string>(defaultTargetLanguage);

    const [clearTimeoutValue, setClearTimeoutValue] = useState<NodeJS.Timeout | undefined>(undefined);

    const search = async (searchTerm: string) => {
        if (!searchTerm.trim().length) {
            setIsLoading(false);
            setTranslatedText("");
            return;
        }

        try {
            const translations = await window.ContextBridge.invokeExtension<InvocationArgument, InvocationResult>(
                extensionId,
                { searchTerm, sourceLanguage, targetLanguage },
            );

            setTranslatedText(translations.join("\n"));
        } catch (error) {
            setTranslatedText("");
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
                await search(userInput);
            }, 250),
        );
    }, [userInput, sourceLanguage, targetLanguage]);

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
                    <Dropdown
                        id="sourceLanguage"
                        className="non-draggable-area"
                        value={sourceLanguages[sourceLanguage]}
                        onOptionSelect={(_, { optionValue }) => optionValue && setSourceLanguage(optionValue)}
                    >
                        {Object.keys(sourceLanguages).map((key) => (
                            <Option value={key} key={key}>
                                {sourceLanguages[key]}
                            </Option>
                        ))}
                    </Dropdown>
                    <Textarea
                        autoFocus
                        style={{ flexGrow: 1, width: "100%", height: "100%" }}
                        placeholder="Type to translate"
                        value={userInput}
                        onChange={(_, { value }) => setUserInput(value)}
                    />
                </div>
                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
                    <Dropdown
                        id="targetLanguage"
                        className="non-draggable-area"
                        value={targetLanguages[targetLanguage]}
                        onOptionSelect={(_, { optionValue }) => optionValue && setTargetLanguage(optionValue)}
                    >
                        {Object.keys(targetLanguages).map((key) => (
                            <Option value={key} key={key}>
                                {targetLanguages[key]}
                            </Option>
                        ))}
                    </Dropdown>
                    <Textarea
                        readOnly
                        style={{ flexGrow: 1, width: "100%", height: "100%" }}
                        placeholder="Translated text will appear here"
                        value={translatedText}
                    />
                </div>
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
    );
};
