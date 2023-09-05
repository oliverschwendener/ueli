import { Dropdown, Option } from "@fluentui/react-components";
import { changeLanguage } from "i18next";
import { useTranslation } from "react-i18next";
import { useSetting } from "../../Hooks";
import { Section } from "../Section";
import { SectionList } from "../SectionList";

type SupportedLanguage = {
    locale: string;
    label: string;
};

const supportedLanguages: SupportedLanguage[] = [
    { label: "English (US)", locale: "en-US" },
    { label: "Deutsch (Schweiz)", locale: "de-CH" },
];

export const General = () => {
    const { t } = useTranslation();

    const { value: language, updateValue: setLanguage } = useSetting("general.language", "en-US", (updatedLanguage) =>
        changeLanguage(updatedLanguage),
    );

    return (
        <SectionList>
            <Section>
                <label id="general.language">{t("settingsGeneral.language")}</label>
                <Dropdown
                    aria-labelledby="general.language"
                    value={supportedLanguages.find(({ locale }) => locale === language)?.label}
                    onOptionSelect={(_, { optionValue }) => optionValue && setLanguage(optionValue)}
                >
                    {supportedLanguages.map(({ label, locale }) => (
                        <Option key={locale} value={locale} text={label}>
                            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 5 }}>
                                <label>{label}</label>
                            </div>
                        </Option>
                    ))}
                </Dropdown>
            </Section>
        </SectionList>
    );
};
