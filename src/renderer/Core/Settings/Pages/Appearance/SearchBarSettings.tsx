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
    const ns = "settingsAppearance";
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
        <SettingGroup title={t("searchBar", { ns })}>
            <Setting
                label={t("searchBarPreview", { ns })}
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
                label={t("searchBarSize", { ns })}
                control={
                    <Dropdown
                        value={t(`searchBarSize.${searchBarSize}`, { ns })}
                        selectedOptions={[searchBarSize]}
                        onOptionSelect={(_, { optionValue }) =>
                            optionValue && setSearchBarSize(optionValue as SearchBarSize)
                        }
                    >
                        <Option value="small">{t("searchBarSize.small", { ns })}</Option>
                        <Option value="medium">{t("searchBarSize.medium", { ns })}</Option>
                        <Option value="large">{t("searchBarSize.large", { ns })}</Option>
                    </Dropdown>
                }
            />
            <Setting
                label={t("searchBarAppearance", { ns })}
                control={
                    <Dropdown
                        value={t(`searchBarAppearance.${searchBarAppearance}`, { ns })}
                        selectedOptions={[searchBarAppearance]}
                        onOptionSelect={(_, { optionValue }) =>
                            optionValue && setSearchBarAppearance(optionValue as SearchBarAppearance)
                        }
                    >
                        <Option value="auto">{t("searchBarAppearance.auto", { ns })}</Option>
                        <Option value="outline">{t("searchBarAppearance.outline", { ns })}</Option>
                        <Option value="underline">{t("searchBarAppearance.underline", { ns })}</Option>
                        <Option value="filled-darker">{t("searchBarAppearance.filled-darker", { ns })}</Option>
                        <Option value="filled-lighter">{t("searchBarAppearance.filled-lighter", { ns })}</Option>
                    </Dropdown>
                }
            />
            <Setting
                label={t("searchBarPlaceholderText", { ns })}
                control={
                    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                        <Input
                            value={searchBarPlaceholderText}
                            onChange={(_, { value }) => setSearchBarPlaceholderText(value)}
                            contentAfter={
                                <Tooltip
                                    content={t("searchBarPlaceholderTextReset", { ns })}
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
                label={t("searchBarShowIcon", { ns })}
                control={<Switch checked={showIcon} onChange={(_, { checked }) => setShowIcon(checked)} />}
            />
        </SettingGroup>
    );
};
