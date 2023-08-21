import { Dropdown, Option } from "@fluentui/react-components";
import { ReactCountryFlag } from "react-country-flag";
import { Section } from "../Section";
import { SectionList } from "../SectionList";
import { useSetting } from "./Hooks";

type Locale = "en" | "de";

type SupportedLanguage = {
    locale: Locale;
    label: string;
    iconCountryCode: string;
};

const supportedLanguages: SupportedLanguage[] = [
    { label: "English", locale: "en", iconCountryCode: "US" },
    { label: "Deutsch", locale: "de", iconCountryCode: "de" },
];

export const General = () => {
    const { value: language, updateValue: setLanguage } = useSetting<Locale>("general.language", "en");

    return (
        <SectionList>
            <Section>
                <Dropdown
                    value={supportedLanguages.find(({ locale }) => locale === language)?.label}
                    onOptionSelect={(_, { optionValue }) => optionValue && setLanguage(optionValue as Locale)}
                >
                    {supportedLanguages.map(({ label, locale, iconCountryCode }) => (
                        <Option key={locale} value={locale} text={label}>
                            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 5 }}>
                                <ReactCountryFlag countryCode={iconCountryCode} svg />
                                <label>{label}</label>
                            </div>
                        </Option>
                    ))}
                </Dropdown>
            </Section>
        </SectionList>
    );
};
