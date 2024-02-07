import { useContextBridge, useExtensionSetting } from "@Core/Hooks";
import { Section } from "@Core/Settings/Section";
import { SectionList } from "@Core/Settings/SectionList";
import { Dropdown, Field, Option } from "@fluentui/react-components";

export const WebSearchSettings = () => {
    const { contextBridge } = useContextBridge();
    const extensionId = "WebSearch";

    const { value: searchEngine, updateValue: setSearchEngine } = useExtensionSetting<string>({
        extensionId,
        key: "searchEngine",
    });

    const { value: locale, updateValue: setLocale } = useExtensionSetting<string>({ extensionId, key: "locale" });

    const searchEngines = ["Google", "DuckDuckGo"];

    const locales = [
        { locale: "en-US", label: "English (US)" },
        { locale: "de-CH", label: "Deutsch (Schweiz)" },
    ];

    return (
        <SectionList>
            <Section>
                <Field label="Search Engine">
                    <Dropdown
                        value={searchEngine}
                        selectedOptions={[searchEngine]}
                        onOptionSelect={(_, { optionValue }) => optionValue && setSearchEngine(optionValue)}
                    >
                        {searchEngines.map((s) => (
                            <Option key={s} value={s} text={s}>
                                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 5 }}>
                                    <img
                                        style={{ width: 16, height: 16 }}
                                        alt={s}
                                        src={`file://${contextBridge.getExtensionAssetFilePath("WebSearch", s)}`}
                                    />
                                    {s}
                                </div>
                            </Option>
                        ))}
                    </Dropdown>
                </Field>
            </Section>
            <Section>
                <Field label="Locale">
                    <Dropdown
                        value={locales.find((l) => l.locale === locale)?.label}
                        selectedOptions={[locale]}
                        onOptionSelect={(_, { optionValue }) => optionValue && setLocale(optionValue)}
                    >
                        {locales.map(({ label, locale }) => (
                            <Option key={locale} value={locale}>
                                {label}
                            </Option>
                        ))}
                    </Dropdown>
                </Field>
            </Section>
        </SectionList>
    );
};
