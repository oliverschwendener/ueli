import { useContextBridge, useExtensionSetting } from "@Core/Hooks";
import { Section } from "@Core/Settings/Section";
import { SectionList } from "@Core/Settings/SectionList";
import { Dropdown, Field, Option, Switch } from "@fluentui/react-components";
import { t } from "i18next";

export const WebSearchSettings = () => {
    const { contextBridge } = useContextBridge();
    const extensionId = "WebSearch";
    const ns = "extension[WebSearch]";

    const { value: searchEngine, updateValue: setSearchEngine } = useExtensionSetting<string>({
        extensionId,
        key: "searchEngine",
    });

    const { value: locale, updateValue: setLocale } = useExtensionSetting<string>({ extensionId, key: "locale" });

    const { value: showInstantSearchResult, updateValue: setShowInstantSearchResult } = useExtensionSetting<boolean>({
        extensionId,
        key: "showInstantSearchResult",
    });

    const searchEngines = ["Google", "DuckDuckGo"];

    const locales = [
        { locale: "en-US", label: "English (US)" },
        { locale: "de-CH", label: "Deutsch (Schweiz)" },
    ];

    return (
        <SectionList>
            <Section>
                <Field label={t("searchEngine", { ns })}>
                    <Dropdown
                        value={searchEngine}
                        selectedOptions={[searchEngine]}
                        onOptionSelect={(_, { optionValue }) => optionValue && setSearchEngine(optionValue)}
                    >
                        {searchEngines.map((searchEngine) => (
                            <Option key={searchEngine} value={searchEngine} text={searchEngine}>
                                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 5 }}>
                                    <img
                                        style={{ width: 16, height: 16 }}
                                        alt={searchEngine}
                                        src={`file://${contextBridge.getExtensionAssetFilePath("WebSearch", searchEngine)}`}
                                    />
                                    {searchEngine}
                                </div>
                            </Option>
                        ))}
                    </Dropdown>
                </Field>
            </Section>
            <Section>
                <Field label={t("locale", { ns })}>
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
            <Section>
                <Field label={t("showInstantSearchResult", { ns })}>
                    <Switch
                        checked={showInstantSearchResult}
                        onChange={(_, { checked }) => setShowInstantSearchResult(checked)}
                    />
                </Field>
            </Section>
        </SectionList>
    );
};
