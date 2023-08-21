import { Dropdown, Option } from "@fluentui/react-components";
import { Section } from "../Section";
import { SectionList } from "../SectionList";
import { useSetting } from "./Hooks";

type SupportedLanguage = {
    locale: string;
    label: string;
};

const supportedLanguages: SupportedLanguage[] = [
    { label: "English (US)", locale: "en-US" },
    { label: "Deutsch (Schweiz)", locale: "de-CH" },
];

export const General = () => {
    const { value: language, updateValue: setLanguage } = useSetting("general.language", "en-US");

    return (
        <SectionList>
            <Section>
                <label id="general.language">Language</label>
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
