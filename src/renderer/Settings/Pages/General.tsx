import { Dropdown, Field, Option } from "@fluentui/react-components";
import { changeLanguage } from "i18next";
import { useTranslation } from "react-i18next";
import { useSetting } from "../../Hooks";
import { supportedLanguages } from "../../I18n";
import { Section } from "../Section";
import { SectionList } from "../SectionList";

export const General = () => {
    const { t } = useTranslation();

    const { value: language, updateValue: setLanguage } = useSetting("general.language", "en-US", (updatedLanguage) =>
        changeLanguage(updatedLanguage),
    );

    return (
        <SectionList>
            <Section>
                <Field label={t("settingsGeneral.language")}>
                    <Dropdown
                        value={supportedLanguages.find(({ locale }) => locale === language)?.name}
                        onOptionSelect={(_, { optionValue }) => optionValue && setLanguage(optionValue)}
                    >
                        {supportedLanguages.map(({ name, locale }) => (
                            <Option key={locale} value={locale} text={name}>
                                {name}
                            </Option>
                        ))}
                    </Dropdown>
                </Field>
            </Section>
        </SectionList>
    );
};
