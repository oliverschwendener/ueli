import { useExtensionSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { SettingGroup } from "@Core/Settings/SettingGroup";
import { SettingGroupList } from "@Core/Settings/SettingGroupList";
import { Dropdown, Input, Option } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { sourceLanguages } from "./sourceLanguages";
import { targetLanguages } from "./targetLanguages";

export const DeeplTranslatorSettings = () => {
    const extensionId = "DeeplTranslator";
    const { t } = useTranslation("extension[DeeplTranslator]");

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

    return (
        <SettingGroupList>
            <SettingGroup title={t("extensionName")}>
                <Setting
                    label="API Key"
                    control={
                        <div style={{ display: "flex", flexDirection: "column", width: "80%" }}>
                            <Input value={apiKey} onChange={(_, { value }) => setApiKey(value)} />
                        </div>
                    }
                />
                <Setting
                    label="Default source language"
                    control={
                        <Dropdown
                            value={sourceLanguages[sourceLanguage]}
                            onOptionSelect={(_, { optionValue }) => optionValue && setSourceLanguage(optionValue)}
                            selectedOptions={[sourceLanguage]}
                        >
                            {Object.keys(sourceLanguages).map((sourceLanguageKey) => (
                                <Option
                                    key={sourceLanguageKey}
                                    value={sourceLanguageKey}
                                    text={sourceLanguages[sourceLanguageKey]}
                                >
                                    {sourceLanguages[sourceLanguageKey]}
                                </Option>
                            ))}
                        </Dropdown>
                    }
                />
                <Setting
                    label="Default target language"
                    control={
                        <Dropdown
                            value={targetLanguages[targetLanguage]}
                            onOptionSelect={(_, { optionValue }) => optionValue && setTargetLanguage(optionValue)}
                            selectedOptions={[targetLanguage]}
                        >
                            {Object.keys(targetLanguages).map((targetLanguageKey) => (
                                <Option
                                    key={targetLanguageKey}
                                    value={targetLanguageKey}
                                    text={targetLanguages[targetLanguageKey]}
                                >
                                    {targetLanguages[targetLanguageKey]}
                                </Option>
                            ))}
                        </Dropdown>
                    }
                />
            </SettingGroup>
        </SettingGroupList>
    );
};
