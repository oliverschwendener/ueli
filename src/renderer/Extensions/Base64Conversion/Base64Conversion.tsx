import { BaseLayout } from "@Core/BaseLayout";
import type { ExtensionProps } from "@Core/ExtensionProps";
import { Header } from "@Core/Header";
import { ThemeContext } from "@Core/Theme/ThemeContext";
import { getImageUrl } from "@Core/getImageUrl";
import { Button, Text } from "@fluentui/react-components";
import { ArrowLeftFilled, CopyRegular } from "@fluentui/react-icons";
import type { KeyboardEvent } from "react";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Converter } from "./Converter";

export const Base64Conversion = ({ contextBridge, goBack }: ExtensionProps) => {
    const { shouldUseDarkColors } = useContext(ThemeContext);
    const { t } = useTranslation("extension[Base64Conversion]");
    const extensionId = "Base64Conversion";

    const [convertedText, setConvertedText] = useState<string>("");

    const handleKeyDownEvent = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            event.preventDefault();
            goBack();
        }
    };

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
                        <img
                            alt="Base64 Logo"
                            src={getImageUrl({
                                image: contextBridge.getExtension(extensionId).image,
                                shouldUseDarkColors,
                            })}
                            style={{ width: 24 }}
                        />
                        <div style={{ flexGrow: 1 }}>
                            <Text weight="semibold">{t("extensionName")}</Text>
                        </div>
                    </div>
                </Header>
            }
            content={
                <Converter
                    setConvertedText={setConvertedText}
                    encodePlaceholder={t("encodePlaceHolder")}
                    decodePlaceholder={t("decodePlaceHolder")}
                />
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
                        disabled={convertedText.length === 0}
                        appearance="subtle"
                        icon={<CopyRegular />}
                        iconPosition="after"
                        onClick={() => contextBridge.copyTextToClipboard(convertedText)}
                    >
                        {t("copyToClipboard")}
                    </Button>
                </div>
            }
            onKeyDown={handleKeyDownEvent}
        />
    );
};
