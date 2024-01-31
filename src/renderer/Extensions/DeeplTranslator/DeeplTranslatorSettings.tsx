import { useContextBridge, useExtensionSetting } from "@Core/Hooks";
import { Section } from "@Core/Settings/Section";
import { SectionList } from "@Core/Settings/SectionList";
import {
    Button,
    Dropdown,
    Field,
    Input,
    Option,
    Toast,
    ToastTitle,
    Toaster,
    Tooltip,
    useId,
    useToastController,
} from "@fluentui/react-components";
import { Virtualizer, useStaticVirtualizerMeasure } from "@fluentui/react-components/unstable";
import { DismissRegular, SaveRegular } from "@fluentui/react-icons";
import { useState } from "react";
import { sourceLanguages } from "./sourceLanguages";
import { targetLanguages } from "./targetLanguages";

export const DeeplTranslatorSettings = () => {
    const { contextBridge } = useContextBridge();

    const extensionId = "DeeplTranslator";

    const { value: apiKey, updateValue: setApiKey } = useExtensionSetting<string>(
        extensionId,
        "apiKey",
        contextBridge.getExtensionSettingDefaultValue(extensionId, "apiKey"),
        true,
    );

    const apiKeyToasterId = useId("apiKeyToaster");
    const { dispatchToast } = useToastController(apiKeyToasterId);

    const [temporaryApiKey, setTemporaryApiKey] = useState<string>(apiKey);

    const saveApiKey = () => {
        setApiKey(temporaryApiKey);
        dispatchToast(
            <Toast>
                <ToastTitle>API Key saved</ToastTitle>
            </Toast>,
            { intent: "success" },
        );
    };

    const removeApiKey = () => {
        setTemporaryApiKey("");
        setApiKey("");
        dispatchToast(
            <Toast>
                <ToastTitle>API Key removed</ToastTitle>
            </Toast>,
            { intent: "success" },
        );
    };

    const { value: sourceLanguage, updateValue: setSourceLanguage } = useExtensionSetting<string>(
        extensionId,
        "defaultSourceLanguage",
        contextBridge.getExtensionSettingDefaultValue(extensionId, "defaultSourceLanguage"),
    );

    const { value: targetLanguage, updateValue: setTargetLanguage } = useExtensionSetting<string>(
        extensionId,
        "defaultTargetLanguage",
        contextBridge.getExtensionSettingDefaultValue(extensionId, "defaultTargetLanguage"),
    );

    const sourceLanguageVirutalizer = useStaticVirtualizerMeasure({
        defaultItemSize: 20,
        direction: "vertical",
    });

    const targetLanguageVirutalizer = useStaticVirtualizerMeasure({
        defaultItemSize: 20,
        direction: "vertical",
    });

    return (
        <SectionList>
            <Section>
                <Field label="API Key">
                    <Toaster toasterId={apiKeyToasterId} />
                    <Input
                        value={temporaryApiKey}
                        onChange={(_, { value }) => setTemporaryApiKey(value)}
                        contentAfter={
                            <>
                                <Tooltip content="Delete" relationship="label">
                                    <Button
                                        size="small"
                                        appearance="subtle"
                                        onClick={() => removeApiKey()}
                                        icon={<DismissRegular />}
                                    />
                                </Tooltip>
                                <Tooltip content="Save" relationship="label">
                                    <Button
                                        size="small"
                                        appearance="subtle"
                                        onClick={() => saveApiKey()}
                                        icon={<SaveRegular />}
                                    />
                                </Tooltip>
                            </>
                        }
                    />
                </Field>
            </Section>
            <Section>
                <Field label="Default source language">
                    <Dropdown
                        value={sourceLanguages[sourceLanguage]}
                        onOptionSelect={(_, { optionValue }) => optionValue && setSourceLanguage(optionValue)}
                        selectedOptions={[sourceLanguage]}
                        listbox={{ ref: sourceLanguageVirutalizer.scrollRef, style: { maxHeight: 145 } }}
                    >
                        <Virtualizer
                            numItems={Object.keys(sourceLanguages).length}
                            virtualizerLength={sourceLanguageVirutalizer.virtualizerLength}
                            bufferItems={sourceLanguageVirutalizer.bufferItems}
                            bufferSize={sourceLanguageVirutalizer.bufferSize}
                            itemSize={20}
                        >
                            {(i) => (
                                <Option
                                    key={Object.keys(sourceLanguages)[i]}
                                    value={Object.keys(sourceLanguages)[i]}
                                    text={Object.values(sourceLanguages)[i]}
                                >
                                    {Object.values(sourceLanguages)[i]}
                                </Option>
                            )}
                        </Virtualizer>
                    </Dropdown>
                </Field>
            </Section>
            <Section>
                <Field label="Default target language">
                    <Dropdown
                        value={targetLanguages[targetLanguage]}
                        onOptionSelect={(_, { optionValue }) => optionValue && setTargetLanguage(optionValue)}
                        selectedOptions={[targetLanguage]}
                        listbox={{ ref: targetLanguageVirutalizer.scrollRef, style: { maxHeight: 145 } }}
                    >
                        <Virtualizer
                            numItems={Object.keys(targetLanguages).length}
                            virtualizerLength={targetLanguageVirutalizer.virtualizerLength}
                            bufferItems={targetLanguageVirutalizer.bufferItems}
                            bufferSize={targetLanguageVirutalizer.bufferSize}
                            itemSize={20}
                        >
                            {(i) => (
                                <Option
                                    key={Object.keys(targetLanguages)[i]}
                                    value={Object.keys(targetLanguages)[i]}
                                    text={Object.values(targetLanguages)[i]}
                                >
                                    {Object.values(targetLanguages)[i]}
                                </Option>
                            )}
                        </Virtualizer>
                    </Dropdown>
                </Field>
            </Section>
        </SectionList>
    );
};
