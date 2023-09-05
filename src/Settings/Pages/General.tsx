import { Dropdown, Option } from "@fluentui/react-components";
import { changeLanguage } from "i18next";
import { useTranslation } from "react-i18next";
import { useSetting } from "../../Hooks";
import { getDefaultLanguage, supportedLanguages } from "../../I18n";
import { Section } from "../Section";
import { SectionList } from "../SectionList";

export const General = () => {
    const { t } = useTranslation();

    const { value: language, updateValue: setLanguage } = useSetting(
        "general.language",
        getDefaultLanguage(),
        (updatedLanguage) => changeLanguage(updatedLanguage),
    );

    return (
        <SectionList>
            <Section>
                <label id="general.language">{t("settingsGeneral.language")}</label>
                <Dropdown
                    aria-labelledby="general.language"
                    value={supportedLanguages.find(({ locale }) => locale === language)?.name}
                    onOptionSelect={(_, { optionValue }) => optionValue && setLanguage(optionValue)}
                >
                    {supportedLanguages.map(({ name, locale }) => (
                        <Option key={locale} value={locale} text={name}>
                            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 5 }}>
                                <label>{name}</label>
                            </div>
                        </Option>
                    ))}
                </Dropdown>
            </Section>
        </SectionList>
    );
};
