import { useSetting } from "@Core/Hooks";
import { SearchBar } from "@Core/Search/SearchBar";
import type { SearchBarAppearance } from "@Core/Search/SearchBarAppearance";
import type { SearchBarSize } from "@Core/Search/SearchBarSize";
import { Setting } from "@Core/Settings/Setting";
import { SettingGroup } from "@Core/Settings/SettingGroup";
import { Button, Dropdown, Input, Option, Switch, Tooltip } from "@fluentui/react-components";
import { ArrowCounterclockwiseRegular } from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";

export const SearchBarSettings = () => {
    const { t } = useTranslation();

    const { value: searchBarSize, updateValue: setSearchBarSize } = useSetting<SearchBarSize>({
        key: "appearance.searchBarSize",
        defaultValue: "large",
    });

    const { value: searchBarAppearance, updateValue: setSearchBarAppearance } = useSetting<SearchBarAppearance>({
        key: "appearance.searchBarAppearance",
        defaultValue: "auto",
    });

    const { value: searchBarPlaceholderText, updateValue: setSearchBarPlaceholderText } = useSetting<string>({
        key: "appearance.searchBarPlaceholderText",
        defaultValue: t("searchBarPlaceholderText", { ns: "search" }),
    });

    const { value: showIcon, updateValue: setShowIcon } = useSetting<boolean>({
        key: "appearance.showSearchIcon",
        defaultValue: true,
    });

    const resetPlaceholderText = () => setSearchBarPlaceholderText(t("searchBarPlaceholderText", { ns: "search" }));

    return (
        <SettingGroup title={t("searchBar", { ns: "settingsAppearance" })}>
            <Setting
                label={t("searchBarPreview", { ns: "settingsAppearance" })}
                control={
                    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                        <SearchBar
                            searchBarSize={searchBarSize}
                            searchBarAppearance={searchBarAppearance}
                            searchBarPlaceholderText={searchBarPlaceholderText}
                            showIcon={showIcon}
                        />
                    </div>
                }
            />
            <Setting
                label={t("searchBarSize", { ns: "settingsAppearance" })}
                control={
                    <Dropdown
                        value={t(`searchBarSize.${searchBarSize}`, { ns: "settingsAppearance" })}
                        selectedOptions={[searchBarSize]}
                        onOptionSelect={(_, { optionValue }) =>
                            optionValue && setSearchBarSize(optionValue as SearchBarSize)
                        }
                    >
                        <Option value="small">{t("searchBarSize.small", { ns: "settingsAppearance" })}</Option>
                        <Option value="medium">{t("searchBarSize.medium", { ns: "settingsAppearance" })}</Option>
                        <Option value="large">{t("searchBarSize.large", { ns: "settingsAppearance" })}</Option>
                    </Dropdown>
                }
            />
            <Setting
                label={t("searchBarAppearance", { ns: "settingsAppearance" })}
                control={
                    <Dropdown
                        value={t(`searchBarAppearance.${searchBarAppearance}`, { ns: "settingsAppearance" })}
                        selectedOptions={[searchBarAppearance]}
                        onOptionSelect={(_, { optionValue }) =>
                            optionValue && setSearchBarAppearance(optionValue as SearchBarAppearance)
                        }
                    >
                        <Option value="auto">{t("searchBarAppearance.auto", { ns: "settingsAppearance" })}</Option>
                        <Option value="outline">
                            {t("searchBarAppearance.outline", { ns: "settingsAppearance" })}
                        </Option>
                        <Option value="underline">
                            {t("searchBarAppearance.underline", { ns: "settingsAppearance" })}
                        </Option>
                        <Option value="filled-darker">
                            {t("searchBarAppearance.filled-darker", { ns: "settingsAppearance" })}
                        </Option>
                        <Option value="filled-lighter">
                            {t("searchBarAppearance.filled-lighter", { ns: "settingsAppearance" })}
                        </Option>
                    </Dropdown>
                }
            />
            <Setting
                label={t("searchBarPlaceholderText", { ns: "settingsAppearance" })}
                control={
                    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                        <Input
                            value={searchBarPlaceholderText}
                            onChange={(_, { value }) => setSearchBarPlaceholderText(value)}
                            contentAfter={
                                <Tooltip
                                    content={t("searchBarPlaceholderTextReset", { ns: "settingsAppearance" })}
                                    relationship="label"
                                    withArrow
                                >
                                    <Button
                                        size="small"
                                        appearance="subtle"
                                        icon={<ArrowCounterclockwiseRegular fontSize={14} />}
                                        onClick={resetPlaceholderText}
                                    />
                                </Tooltip>
                            }
                        />
                    </div>
                }
            />
            <Setting
                label={t("searchBarShowIcon", { ns: "settingsAppearance" })}
                control={<Switch checked={showIcon} onChange={(_, { checked }) => setShowIcon(checked)} />}
            />
        </SettingGroup>
    );
};
