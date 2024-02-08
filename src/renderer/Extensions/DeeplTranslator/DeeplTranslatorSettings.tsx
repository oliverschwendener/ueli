import { useExtensionSetting } from "@Core/Hooks";
import { Section } from "@Core/Settings/Section";
import { SectionList } from "@Core/Settings/SectionList";
import { Dropdown, Field, Input, Option } from "@fluentui/react-components";
import { Virtualizer, useStaticVirtualizerMeasure } from "@fluentui/react-components/unstable";
import { sourceLanguages } from "./sourceLanguages";
import { targetLanguages } from "./targetLanguages";

export const DeeplTranslatorSettings = () => {
    const extensionId = "DeeplTranslator";

    const { value: apiKey, updateValue: setApiKey } = useExtensionSetting<string>({
        extensionId,
        key: "apiKey",
        isSensitive: true,
    });

    const { value: sourceLanguage, updateValue: setSourceLanguage } = useExtensionSetting<string>({
        extensionId,
        key: "defaultSourceLanguage",
    });

    const { value: targetLanguage, updateValue: setTargetLanguage } = useExtensionSetting<string>({
        extensionId,
        key: "defaultTargetLanguage",
    });

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
                    <Input value={apiKey} onChange={(_, { value }) => setApiKey(value)} />
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
