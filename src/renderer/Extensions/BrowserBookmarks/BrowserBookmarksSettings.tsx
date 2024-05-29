import { useContextBridge, useExtensionSetting } from "@Core/Hooks";
import { Section } from "@Core/Settings/Section";
import { SectionList } from "@Core/Settings/SectionList";
import type { Browser } from "@common/Extensions/BrowserBookmarks";
import { Dropdown, Field, Option } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const BrowserBookmarksSettings = () => {
    const { t } = useTranslation();
    const ns = "extension[BrowserBookmarks]";
    const { contextBridge } = useContextBridge();

    const extensionId = "BrowserBookmarks";

    const browserOptions: Browser[] = [
        "Arc",
        "Brave Browser",
        "Firefox",
        "Google Chrome",
        "Microsoft Edge",
        "Yandex Browser",
    ];

    const searchResultStyles = ["nameOnly", "urlOnly", "nameAndUrl"];

    const { value: browsers, updateValue: setBrowsers } = useExtensionSetting<Browser[]>({
        extensionId,
        key: "browsers",
    });

    const { value: searchResultStyle, updateValue: setSearchResultStyle } = useExtensionSetting<string>({
        extensionId,
        key: "searchResultStyle",
    });

    const { value: iconType, updateValue: setIconType } = useExtensionSetting<string>({
        extensionId,
        key: "iconType",
    });

    return (
        <SectionList>
            <Section>
                <Field label="Browsers">
                    <Dropdown
                        value={browsers.join(", ")}
                        selectedOptions={browsers}
                        onOptionSelect={(_, { selectedOptions }) => setBrowsers(selectedOptions as Browser[])}
                        multiselect
                    >
                        {browserOptions.map((browserName) => (
                            <Option key={browserName} value={browserName} text={browserName}>
                                <img
                                    style={{ width: 20, height: 20 }}
                                    alt={browserName}
                                    src={`file://${contextBridge.getExtensionAssetFilePath(extensionId, browserName)}`}
                                />
                                {browserName}
                            </Option>
                        ))}
                    </Dropdown>
                </Field>
            </Section>
            <Section>
                <Field label="Search result style">
                    <Dropdown
                        value={t(`searchResultStyle.${searchResultStyle}`, { ns })}
                        selectedOptions={[searchResultStyle]}
                        onOptionSelect={(_, { optionValue }) => optionValue && setSearchResultStyle(optionValue)}
                    >
                        {searchResultStyles.map((s) => (
                            <Option key={`searchResultStyle.${s}`} value={s}>
                                {t(`searchResultStyle.${s}`, { ns })}
                            </Option>
                        ))}
                    </Dropdown>
                </Field>
            </Section>
            <Section>
                <Field label="Icon Type">
                    <Dropdown
                        value={t(`iconType.${iconType}`, { ns })}
                        selectedOptions={[iconType]}
                        onOptionSelect={(_, { optionValue }) => optionValue && setIconType(optionValue)}
                    >
                        <Option value="favicon">{t("iconType.favicon", { ns })}</Option>
                        <Option value="browserIcon">{t("iconType.browserIcon", { ns })}</Option>
                    </Dropdown>
                </Field>
            </Section>
        </SectionList>
    );
};
