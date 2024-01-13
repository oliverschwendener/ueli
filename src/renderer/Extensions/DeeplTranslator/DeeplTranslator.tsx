import { Button, Text } from "@fluentui/react-components";
import { ArrowLeftFilled, CopyRegular } from "@fluentui/react-icons";
import { useState } from "react";
import { BaseLayout } from "../../BaseLayout";
import type { ExtensionProps } from "../../ExtensionProps";
import { Header } from "../../Header";
import { useExtensionSetting } from "../../Hooks/useExtensionSetting";
import { MissingApiKey } from "./MissingApiKey";
import { Translator } from "./Translator";

export const DeeplTranslator = ({ contextBridge, goBack }: ExtensionProps) => {
    const extensionId = "DeeplTranslator";

    const extensionImageUrl = () => contextBridge.getExtensionImageUrl(extensionId);

    const { value: apiKey, updateValue: setApiKey } = useExtensionSetting(extensionId, "apiKey", "");

    const [translatedText, setTranslatedText] = useState<string>("");

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
                apiKey ? (
                    <Translator
                        translatedText={translatedText}
                        setTranslatedText={(t) => setTranslatedText(t)}
                        contextBridge={contextBridge}
                    />
                ) : (
                    <MissingApiKey onApiKeySet={(v) => setApiKey(v)} />
                )
            }
            footer={
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        padding: 10,
                        boxSizing: "border-box",
                    }}
                >
                    <Button
                        disabled={translatedText.length === 0}
                        appearance="subtle"
                        icon={<CopyRegular />}
                        iconPosition="after"
                        onClick={() => contextBridge.copyTextToClipboard(translatedText)}
                    >
                        Copy translated text
                    </Button>
                </div>
            }
        />
    );
};
