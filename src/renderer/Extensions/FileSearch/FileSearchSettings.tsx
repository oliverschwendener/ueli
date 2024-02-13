import { useContextBridge, useExtensionSetting } from "@Core/Hooks";
import { Section } from "@Core/Settings/Section";
import { SectionList } from "@Core/Settings/SectionList";
import { Field, Input, SpinButton } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const FileSearchSettings = () => {
    const { t } = useTranslation();
    const ns = "extension[FileSearch]";
    const { contextBridge } = useContextBridge();

    const { value: maxSearchResultCount, updateValue: setMaxSearchResultCount } = useExtensionSetting<number>({
        extensionId: "FileSearch",
        key: "maxSearchResultCount",
    });

    const { value: esFilePath, updateValue: setEsFilePath } = useExtensionSetting<string>({
        extensionId: "FileSearch",
        key: "everythingCliFilePath",
    });

    return (
        <SectionList>
            <Section>
                <Field label={t("maxSearchResults", { ns })}>
                    <SpinButton
                        value={maxSearchResultCount}
                        min={1}
                        onChange={(_, { value }) => value && setMaxSearchResultCount(value)}
                    />
                </Field>
            </Section>
            {contextBridge.getOperatingSystem() === "Windows" ? (
                <Section>
                    <Field
                        label={t("esFilePath", { ns })}
                        validationMessage={
                            contextBridge.fileExists(esFilePath) ? undefined : t("fileDoesNotExist", { ns })
                        }
                        validationState={contextBridge.fileExists(esFilePath) ? "success" : "error"}
                    >
                        <Input value={esFilePath} onChange={(_, { value }) => setEsFilePath(value)} />
                    </Field>
                </Section>
            ) : null}
        </SectionList>
    );
};
