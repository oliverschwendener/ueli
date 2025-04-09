import { useSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { Dropdown, Option } from "@fluentui/react-components";
import i18next from "i18next";
import { useTranslation } from "react-i18next";

export const Language = () => {
    const { t } = useTranslation();

    const languages = [
        { name: "English (US)", locale: "en-US" },
        { name: "Deutsch (Schweiz)", locale: "de-CH" },
        { name: "日本語 (日本)", locale: "ja-JP" },
    ];

    const { value: language, updateValue: setLanguage } = useSetting({
        key: "general.language",
        defaultValue: "en-US",
    });

    const changeLanguage = (language: string) => {
        i18next.changeLanguage(language);
        setLanguage(language);
    };

    return (
        <Setting
            label={t("language", { ns: "settingsGeneral" })}
            control={
                <Dropdown
                    value={languages.find(({ locale }) => locale === language)?.name}
                    selectedOptions={[language]}
                    onOptionSelect={(_, { optionValue }) => optionValue && changeLanguage(optionValue)}
                >
                    {languages.map(({ name, locale }) => (
                        <Option key={locale} value={locale} text={name}>
                            {name}
                        </Option>
                    ))}
                </Dropdown>
            }
        />
    );
};
