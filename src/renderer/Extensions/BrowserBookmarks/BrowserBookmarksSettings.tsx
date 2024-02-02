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

    const browsers: Browser[] = ["Arc", "Brave Browser", "Google Chrome", "Microsoft Edge", "Yandex Browser"];
    const searchResultStyles = ["nameOnly", "urlOnly", "nameAndUrl"];
    const faviconApis = ["Google", "favicone.com"];

    const { value: browser, updateValue: setBrowser } = useExtensionSetting<Browser>(
        extensionId,
        "browser",
        contextBridge.getExtensionSettingDefaultValue(extensionId, "browser"),
    );

    const { value: searchResultStyle, updateValue: setSearchResultStyle } = useExtensionSetting<string>(
        extensionId,
        "searchResultStyle",
        contextBridge.getExtensionSettingDefaultValue(extensionId, "searchResultStyle"),
    );

    const { value: faviconApi, updateValue: setFaviconApi } = useExtensionSetting<string>(
        extensionId,
        "faviconApi",
        contextBridge.getExtensionSettingDefaultValue(extensionId, "faviconApi"),
    );

    return (
        <SectionList>
            <Section>
                <Field label="Browser">
                    <Dropdown
                        value={`${browser}`}
                        selectedOptions={[browser]}
                        onOptionSelect={(_, { optionValue }) => optionValue && setBrowser(optionValue as Browser)}
                    >
                        {browsers.map((browserName) => (
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
                <Field label="Favicon API" hint="This API is used to generate the search result icon">
                    <Dropdown
                        value={faviconApi}
                        selectedOptions={[faviconApi]}
                        onOptionSelect={(_, { optionValue }) => optionValue && setFaviconApi(optionValue)}
                    >
                        {faviconApis.map((f) => (
                            <Option key={`faviconApi-${f}`} value={f} text={f}>
                                {f}
                            </Option>
                        ))}
                    </Dropdown>
                </Field>
            </Section>
        </SectionList>
    );
};
