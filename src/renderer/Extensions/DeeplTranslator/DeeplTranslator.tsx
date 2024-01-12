import { Button, Divider, Dropdown, Field, Input, Label, Option, Spinner } from "@fluentui/react-components";
import { ArrowLeftRegular } from "@fluentui/react-icons";
import { useEffect, useState } from "react";
import type { ExtensionProps } from "../../ExtensionProps";
import { sourceLanguages } from "./sourceLanguages";
import { targetLanguages } from "./targetLanguages";

export const DeeplTranslator = ({ contextBridge, goBack }: ExtensionProps) => {
    const [userInput, setUserInput] = useState<string>("");

    const [sourceLanguage, setSourceLanguage] = useState<string>(
        contextBridge.getExtensionSettingByKey("DeeplTranslator", "defaultSourceLanguage", "Auto"),
    );

    const [targetLanguage, setTargetLanguage] = useState<string>(
        contextBridge.getExtensionSettingByKey("DeeplTranslator", "defaultTargetLanguage", "DE"),
    );

    const [translations, setTranslations] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [clearTimeoutValue, setClearTimeoutValue] = useState<NodeJS.Timeout | undefined>(undefined);

    const search = async (searchTerm: string) => {
        if (!searchTerm.trim().length) {
            return;
        }

        try {
            setIsLoading(true);

            const r = await contextBridge.invokeExtension<
                { searchTerm: string; sourceLanguage: string; targetLanguage: string },
                string[]
            >("DeeplTranslator", {
                searchTerm,
                sourceLanguage,
                targetLanguage,
            });

            setTranslations(r);
        } catch (error) {
            // do nothing
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (clearTimeoutValue) {
            clearTimeout(clearTimeoutValue);
        }

        setClearTimeoutValue(
            setTimeout(() => {
                setClearTimeoutValue(undefined);
                search(userInput);
            }, 250),
        );
    }, [userInput, sourceLanguage, targetLanguage]);

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={{ flexShrink: 0 }}>
                <div
                    className="draggable-area"
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        padding: 10,
                        gap: 10,
                        boxSizing: "border-box",
                    }}
                >
                    <Button
                        size="small"
                        appearance="subtle"
                        className="non-draggable-area"
                        onClick={goBack}
                        icon={<ArrowLeftRegular />}
                    ></Button>
                    <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
                        <Input
                            className="non-draggable-area"
                            autoFocus
                            value={userInput}
                            onChange={(_, { value }) => setUserInput(value)}
                        />
                    </div>
                    <div style={{ width: "250px", display: "flex", flexDirection: "column" }}>
                        <Field>
                            <label htmlFor="sourceLanguage">Source Language</label>
                            <Dropdown
                                id="sourceLanguage"
                                className="non-draggable-area"
                                value={sourceLanguage}
                                onOptionSelect={(_, { optionValue }) => optionValue && setSourceLanguage(optionValue)}
                            >
                                {Object.keys(sourceLanguages).map((key) => (
                                    <Option value={key} key={key}>
                                        {sourceLanguages[key]}
                                    </Option>
                                ))}
                            </Dropdown>
                        </Field>
                        <Field>
                            <label htmlFor="targetLanguage">TargetLanguage</label>
                            <Dropdown
                                id="targetLanguage"
                                className="non-draggable-area"
                                value={targetLanguage}
                                onOptionSelect={(_, { optionValue }) => optionValue && setTargetLanguage(optionValue)}
                            >
                                {Object.keys(targetLanguages).map((key) => (
                                    <Option value={key} key={key}>
                                        {targetLanguages[key]}
                                    </Option>
                                ))}
                            </Dropdown>
                        </Field>
                    </div>
                </div>
                <Divider appearance="subtle" />
            </div>

            <div
                style={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "row",
                    boxSizing: "border-box",
                    height: "100%",
                    width: "100%",
                    overflow: "hidden",
                }}
            >
                <div style={{ width: "100%", height: "100%" }}>
                    {isLoading ? (
                        <div
                            style={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}
                        >
                            <Spinner />
                        </div>
                    ) : (
                        translations.map((t) => <Label>{t}</Label>)
                    )}
                </div>
            </div>
        </div>
    );
};
