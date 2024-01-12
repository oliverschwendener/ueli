import { Button, Dropdown, Field, Input, Option, ProgressBar, Textarea } from "@fluentui/react-components";
import { ArrowLeftFilled, CopyRegular } from "@fluentui/react-icons";
import { useEffect, useState } from "react";
import { BaseLayout } from "../../BaseLayout";
import type { ExtensionProps } from "../../ExtensionProps";
import { Footer } from "../../Footer";
import { Header } from "../../Header";
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

    const translatedText = () => translations.join("\n");

    const search = async (searchTerm: string) => {
        if (!searchTerm.trim().length) {
            setTranslations([]);
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
        <BaseLayout
            header={
                <Header
                    text="DeepL Translator"
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
                />
            }
            content={
                <div
                    style={{ display: "flex", flexDirection: "column", padding: 10, boxSizing: "border-box", gap: 10 }}
                >
                    <Input
                        className="non-draggable-area"
                        autoFocus
                        value={userInput}
                        onChange={(_, { value }) => setUserInput(value)}
                        placeholder="Type something in here"
                    />

                    <Textarea
                        readOnly
                        resize="vertical"
                        style={{ width: "100%", height: 200 }}
                        placeholder="Translated text"
                        value={translatedText()}
                    />

                    <div>
                        <Button
                            disabled={translatedText().length === 0}
                            appearance="subtle"
                            icon={<CopyRegular />}
                            iconPosition="after"
                        >
                            Copy text
                        </Button>
                    </div>

                    {isLoading && <ProgressBar />}
                </div>
            }
            footer={
                <Footer>
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
                </Footer>
            }
        />
    );
};
