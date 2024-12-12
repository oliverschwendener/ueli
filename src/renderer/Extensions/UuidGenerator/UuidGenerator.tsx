import { BaseLayout } from "@Core/BaseLayout";
import type { ExtensionProps } from "@Core/ExtensionProps";
import { Header } from "@Core/Header";
import { getImageUrl } from "@Core/getImageUrl";
import { Button, Text } from "@fluentui/react-components";
import { ArrowLeftFilled, CopyRegular } from "@fluentui/react-icons";
import type { KeyboardEvent } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Generator } from "./Generator";

export const UuidGenerator = ({ contextBridge, goBack }: ExtensionProps) => {
    const { t } = useTranslation("extension[UuidGenerator]");
    const extensionId = "UuidGenerator";

    const [generatedUuids, setGeneratedUuids] = useState<string>("");

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
                            alt="UUID Generator Logo"
                            src={getImageUrl({
                                image: contextBridge.getExtension(extensionId).image,
                                shouldPreferDarkColors: contextBridge.themeShouldUseDarkColors(),
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
                <Generator
                    generatedUuids={generatedUuids}
                    setGeneratedUuids={setGeneratedUuids}
                    uuidVersionLabel={t("uuidVersion")}
                    numberOfUuidsLabel={t("numberOfUuids")}
                    uppercaseLabel={t("uppercase")}
                    bracesLabel={t("braces")}
                    quotesLabel={t("quotes")}
                    hyphensLabel={t("hyphens")}
                    contextBridge={contextBridge}
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
                        disabled={generatedUuids.length === 0}
                        appearance="subtle"
                        icon={<CopyRegular />}
                        iconPosition="after"
                        onClick={() => contextBridge.copyTextToClipboard(generatedUuids)}
                    >
                        {t("copyUuidsToClipboard")}
                    </Button>
                </div>
            }
            onKeyDown={handleKeyDownEvent}
        />
    );
};
