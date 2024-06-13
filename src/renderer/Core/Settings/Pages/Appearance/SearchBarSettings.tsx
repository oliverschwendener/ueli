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
        <SettingGroup title="Search bar">
            <Setting
                label="Preview"
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
                label="Size"
                control={
                    <Dropdown
                        value={searchBarSize}
                        selectedOptions={[searchBarSize]}
                        onOptionSelect={(_, { optionValue }) =>
                            optionValue && setSearchBarSize(optionValue as SearchBarSize)
                        }
                    >
                        <Option value="small">small</Option>
                        <Option value="medium">medium</Option>
                        <Option value="large">large</Option>
                    </Dropdown>
                }
            />
            <Setting
                label="Appearance"
                control={
                    <Dropdown
                        value={searchBarAppearance}
                        selectedOptions={[searchBarAppearance]}
                        onOptionSelect={(_, { optionValue }) =>
                            optionValue && setSearchBarAppearance(optionValue as SearchBarAppearance)
                        }
                    >
                        <Option value="auto">auto</Option>
                        <Option value="outline">outline</Option>
                        <Option value="underline">underline</Option>
                        <Option value="filled-darker">filled-darker</Option>
                        <Option value="filled-lighter">filled-lighter</Option>
                    </Dropdown>
                }
            />
            <Setting
                label="Placeholder text"
                control={
                    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                        <Input
                            value={searchBarPlaceholderText}
                            onChange={(_, { value }) => setSearchBarPlaceholderText(value)}
                            contentAfter={
                                <Tooltip content="Reset" relationship="label" withArrow>
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
                label="Icon"
                description="Wether to show the search icon in the search bar"
                control={<Switch checked={showIcon} onChange={(_, { checked }) => setShowIcon(checked)} />}
            />
        </SettingGroup>
    );
};
