import { useContextBridge, useExtensionSetting } from "@Core/Hooks";
import { Section } from "@Core/Settings/Section";
import { SectionList } from "@Core/Settings/SectionList";
import type { Browser } from "@common/Extensions/BrowserBookmarks";
import { Dropdown, Field, Option } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const BrowserBookmarksSettings = () => {
    const { t } = useTranslation();
    const { contextBridge } = useContextBridge();

    const extensionId = "BrowserBookmarks";

    const { value: browser, updateValue: setBrowser } = useExtensionSetting<Browser>(
        extensionId,
        "browser",
        contextBridge.getExtensionSettingDefaultValue(extensionId, "browser"),
    );

    const browsers: Browser[] = ["Arc", "Brave Browser", "Google Chrome", "Microsoft Edge", "Yandex Browser"];

    const { value: searchResultStyle, updateValue: setSearchResultStyle } = useExtensionSetting<string>(
        extensionId,
        "searchResultStyle",
        contextBridge.getExtensionSettingDefaultValue(extensionId, "searchResultStyle"),
    );

    const searchResultStyles = ["nameOnly", "urlOnly", "nameAndUrl"];

    return (
        <SectionList>
            <Section>
                <Field label="Search result style">
                    <Dropdown
                        value={t(`extension[BrowserBookmarks].searchResultStyle.${searchResultStyle}`)}
                        selectedOptions={[searchResultStyle]}
                        onOptionSelect={(_, { optionValue }) => optionValue && setSearchResultStyle(optionValue)}
                    >
                        {searchResultStyles.map((s) => (
                            <Option key={`searchResultStyle.${s}`} value={s}>
                                {t(`extension[BrowserBookmarks].searchResultStyle.${s}`)}
                            </Option>
                        ))}
                    </Dropdown>
                </Field>
            </Section>
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
                                    src={`file://${contextBridge.getExtensionAssetFilePath(
                                        extensionId,
                                        `browser:${browserName}`,
                                    )}`}
                                />
                                {browserName}
                            </Option>
                        ))}
                    </Dropdown>
                </Field>
            </Section>
        </SectionList>
    );
};
