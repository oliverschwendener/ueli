import { useSetting } from "@Core/Hooks";
import { Dropdown, Field, Option } from "@fluentui/react-components";
import { changeLanguage } from "i18next";
import { useTranslation } from "react-i18next";

export const Language = () => {
    const { t } = useTranslation();

    const languages = [
        { name: "English (US)", locale: "en-US" },
        { name: "Deutsch (Schweiz)", locale: "de-CH" },
    ];

    const { value: language, updateValue: setLanguage } = useSetting(
        "general.language",
        "en-US",
        false,
        (updatedLanguage) => changeLanguage(updatedLanguage),
    );

    return (
        <Field label={t("settingsGeneral.language")}>
            <Dropdown
                value={languages.find(({ locale }) => locale === language)?.name}
                selectedOptions={[language]}
                onOptionSelect={(_, { optionValue }) => optionValue && setLanguage(optionValue)}
            >
                {languages.map(({ name, locale }) => (
                    <Option key={locale} value={locale} text={name}>
                        {name}
                    </Option>
                ))}
            </Dropdown>
        </Field>
    );
};
