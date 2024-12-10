import { useExtensionSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { SettingGroup } from "@Core/Settings/SettingGroup";
import { SettingGroupList } from "@Core/Settings/SettingGroupList";
import type { Browser } from "@common/Extensions/BrowserBookmarks";
import { Dropdown, Option } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const BrowserBookmarksSettings = () => {
    const { t } = useTranslation("extension[BrowserBookmarks]");

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
        <SettingGroupList>
            <SettingGroup title={t("extensionName")}>
                <Setting
                    label="Browsers"
                    control={
                        <Dropdown
                            value={browsers.join(", ")}
                            selectedOptions={browsers}
                            onOptionSelect={(_, { selectedOptions }) => setBrowsers(selectedOptions as Browser[])}
                            multiselect
                            placeholder={t("selectBrowsers")}
                        >
                            {browserOptions.map((browserName) => (
                                <Option key={browserName} value={browserName} text={browserName}>
                                    <img
                                        style={{ width: 20, height: 20 }}
                                        alt={browserName}
                                        src={`file://${window.ContextBridge.getExtensionAssetFilePath(extensionId, browserName)}`}
                                    />
                                    {browserName}
                                </Option>
                            ))}
                        </Dropdown>
                    }
                />
                <Setting
                    label="Search result style"
                    control={
                        <Dropdown
                            value={t(`searchResultStyle.${searchResultStyle}`)}
                            selectedOptions={[searchResultStyle]}
                            onOptionSelect={(_, { optionValue }) => optionValue && setSearchResultStyle(optionValue)}
                        >
                            {searchResultStyles.map((s) => (
                                <Option key={`searchResultStyle.${s}`} value={s}>
                                    {t(`searchResultStyle.${s}`)}
                                </Option>
                            ))}
                        </Dropdown>
                    }
                />
                <Setting
                    label="Icon Type"
                    control={
                        <Dropdown
                            value={t(`iconType.${iconType}`)}
                            selectedOptions={[iconType]}
                            onOptionSelect={(_, { optionValue }) => optionValue && setIconType(optionValue)}
                        >
                            <Option value="favicon">{t("iconType.favicon")}</Option>
                            <Option value="browserIcon">{t("iconType.browserIcon")}</Option>
                        </Dropdown>
                    }
                />
            </SettingGroup>
        </SettingGroupList>
    );
};
