import { Button, Dropdown, Field, Option, Text, Textarea } from "@fluentui/react-components";
import { ArrowLeftFilled, CopyRegular } from "@fluentui/react-icons";
import { useEffect, useState } from "react";
import { BaseLayout } from "../../BaseLayout";
import type { ExtensionProps } from "../../ExtensionProps";
import { Footer } from "../../Footer";
import { Header } from "../../Header";
import { sourceLanguages } from "./sourceLanguages";
import { targetLanguages } from "./targetLanguages";

export const DeeplTranslator = ({ contextBridge, goBack }: ExtensionProps) => {
    const extensionId = "DeeplTranslator";

    const [userInput, setUserInput] = useState<string>("");

    const [sourceLanguage, setSourceLanguage] = useState<string>(
        contextBridge.getExtensionSettingByKey(
            extensionId,
            "defaultSourceLanguage",
            contextBridge.getExtensionSettingDefaultValue(extensionId, "defaultSourceLanguage"),
        ),
    );

    const [targetLanguage, setTargetLanguage] = useState<string>(
        contextBridge.getExtensionSettingByKey(
            extensionId,
            "defaultTargetLanguage",
            contextBridge.getExtensionSettingDefaultValue(extensionId, "defaultTargetLanguage"),
        ),
    );

    const [translations, setTranslations] = useState<string[]>([]);
    const [clearTimeoutValue, setClearTimeoutValue] = useState<NodeJS.Timeout | undefined>(undefined);

    const extensionImageUrl = () => contextBridge.getExtensionImageUrl(extensionId);

    const translatedText = () => translations.join("\n");

    const search = async (searchTerm: string) => {
        if (!searchTerm.trim().length) {
            setTranslations([]);
            return;
        }

        try {
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
            setTranslations([]);
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
        <BaseLayout
            header={
                <Header
                    draggable
                    contentBefore={
                        <Button
                            size="small"
                            appearance="subtle"
                            className="non-draggable-area"
                            onClick={goBack}
                            icon={<ArrowLeftFilled fontSize={14} />}
                        ></Button>
                    }
                >
                    <img src={extensionImageUrl()} style={{ width: 24 }} />
                    <Text weight="semibold">DeepL Translator</Text>
                </Header>
            }
            content={
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
                        <Textarea
                            autoFocus
                            style={{ flexGrow: 1, height: "100%" }}
                            placeholder="Type to translate"
                            value={userInput}
                            onChange={(_, { value }) => setUserInput(value)}
                        />

                        <Textarea
                            readOnly
                            tabIndex={-1} // This makes the text are not focusable
                            style={{ flexGrow: 1, height: "100%" }}
                            placeholder="Translated text will appear here"
                            value={translatedText()}
                        />
                    </div>
                    <div style={{ flexShrink: 0 }}>
                        <Button
                            disabled={translatedText().length === 0}
                            appearance="subtle"
                            icon={<CopyRegular />}
                            iconPosition="after"
                            onClick={() => contextBridge.copyTextToClipboard(translatedText())}
                        >
                            Copy text
                        </Button>
                    </div>
                </div>
            }
            footer={
                <Footer>
                    <Field label="Source language">
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
                    </Field>
                    <Field label="Target language">
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
                    </Field>
                </Footer>
            }
        />
    );
};
