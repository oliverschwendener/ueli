import { BaseLayout } from "@Core/BaseLayout";
import type { ExtensionProps } from "@Core/ExtensionProps";
import { Header } from "@Core/Header";
import { Button, Field, Input, Text } from "@fluentui/react-components";
import { ArrowLeftRegular } from "@fluentui/react-icons";
import type { KeyboardEvent } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const MissingEverythingCliFilePath = ({
    contextBridge,
    goBack,
    setEsFilePath,
}: ExtensionProps & { setEsFilePath: (esFilePath: string) => void }) => {
    const { t } = useTranslation("extension[FileSearch]");

    const [temporaryEsFilePath, setTemporaryEsCliFilePath] = useState<string>("");

    const temporaryEsFilePathExists = contextBridge.fileExists(temporaryEsFilePath);

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
                    children={<Text>{t("extensionName")}</Text>}
                    contentBefore={
                        <Button size="small" appearance="subtle" onClick={() => goBack()} icon={<ArrowLeftRegular />} />
                    }
                />
            }
            content={
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 5,
                        height: "100%",
                    }}
                >
                    <Field
                        label={t("esFilePath")}
                        validationMessage={temporaryEsFilePathExists ? undefined : t("fileDoesNotExist")}
                        validationState={temporaryEsFilePathExists ? "success" : "error"}
                    >
                        <Input
                            autoFocus
                            value={temporaryEsFilePath}
                            onChange={(_, { value }) => setTemporaryEsCliFilePath(value)}
                        />
                    </Field>
                    <Button disabled={!temporaryEsFilePathExists} onClick={() => setEsFilePath(temporaryEsFilePath)}>
                        Continue
                    </Button>
                </div>
            }
            onKeyDown={handleKeyDownEvent}
        />
    );
};
