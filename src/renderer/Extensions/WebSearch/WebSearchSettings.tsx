import { useExtensionSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { SettingGroup } from "@Core/Settings/SettingGroup";
import { SettingGroupList } from "@Core/Settings/SettingGroupList";
import { Dropdown, Option, Switch } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const WebSearchSettings = () => {
    const extensionId = "WebSearch";

    const { t } = useTranslation("extension[WebSearch]");

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
        { locale: "ja-JP", label: "日本語 (日本)" },
        { locale: "ko-KR", label: "한국어 (대한민국)" },
    ];

    return (
        <SettingGroupList>
            <SettingGroup title={t("extensionName")}>
                <Setting
                    label={t("searchEngine")}
                    control={
                        <Dropdown
                            value={searchEngine}
                            selectedOptions={[searchEngine]}
                            onOptionSelect={(_, { optionValue }) => optionValue && setSearchEngine(optionValue)}
                        >
                            {searchEngines.map((searchEngine) => (
                                <Option key={searchEngine} value={searchEngine} text={searchEngine}>
                                    <div
                                        style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 5 }}
                                    >
                                        <img
                                            style={{ width: 16, height: 16 }}
                                            alt={searchEngine}
                                            src={`file://${window.ContextBridge.getExtensionAssetFilePath("WebSearch", searchEngine)}`}
                                        />
                                        {searchEngine}
                                    </div>
                                </Option>
                            ))}
                        </Dropdown>
                    }
                />
                <Setting
                    label={t("locale")}
                    control={
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
                    }
                />
                <Setting
                    label={t("showInstantSearchResult")}
                    control={
                        <Switch
                            checked={showInstantSearchResult}
                            onChange={(_, { checked }) => setShowInstantSearchResult(checked)}
                        />
                    }
                />
            </SettingGroup>
        </SettingGroupList>
    );
};
