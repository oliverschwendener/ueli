import { BaseLayout } from "@Core/BaseLayout";
import type { ExtensionProps } from "@Core/ExtensionProps";
import { Header } from "@Core/Header";
import { useExtensionSetting } from "@Core/Hooks";
import { Button, Text, Tooltip } from "@fluentui/react-components";
import { ArrowLeftFilled, CopyRegular, PersonRegular } from "@fluentui/react-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MissingApiKey } from "./MissingApiKey";
import { Translator } from "./Translator";

export const DeeplTranslator = ({ contextBridge, goBack }: ExtensionProps) => {
    const extensionId = "DeeplTranslator";

    const { t } = useTranslation();

    const extensionImageUrl = () => contextBridge.getExtensionImageUrl(extensionId);

    const { value: apiKey, updateValue: setApiKey } = useExtensionSetting(extensionId, "apiKey", "", true);

    const [translatedText, setTranslatedText] = useState<string>("");

    const openDeeplWebsite = () => contextBridge.openExternal("https://www.deepl.com/signup?cta=free-login-signup");
    const openDeeplAccount = () => contextBridge.openExternal("https://www.deepl.com/account");

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
                    <div
                        style={{ display: "flex", flexDirection: "row", alignItems: "center", width: "100%", gap: 10 }}
                    >
                        <img alt="DeepL Logo" src={extensionImageUrl()} style={{ width: 24 }} />
                        <div style={{ flexGrow: 1 }}>
                            <Text weight="semibold">{t("extension[DeeplTranslator].extensionName")}</Text>
                        </div>
                        <Tooltip content={t("extension[DeeplTranslator].openAccount")} relationship="label">
                            <Button
                                onClick={() => openDeeplAccount()}
                                className="non-draggable-area"
                                size="small"
                                appearance="subtle"
                                icon={<PersonRegular fontSize={14} />}
                            />
                        </Tooltip>
                    </div>
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
                    <MissingApiKey saveApiKey={(v) => setApiKey(v)} openSignUpWebsite={openDeeplWebsite} />
                )
            }
            footer={
                apiKey ? (
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
                ) : null
            }
        />
    );
};
