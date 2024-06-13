import { useContextBridge, useSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { SettingGroup } from "@Core/Settings/SettingGroup";
import { Caption1, Dropdown, Input, Option } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

type SearchBarSize = "small" | "medium" | "large";
type SearchBarAppearance = "outline" | "underline" | "filled-darker" | "filled-lighter" | "auto";

export const SearchBarSettings = () => {
    const { t } = useTranslation("settingsAppearance");
    const { contextBridge } = useContextBridge();

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
        defaultValue: t("searchBarPlaceholderText"),
    });

    return (
        <SettingGroup title="Search bar">
            <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingBottom: 10 }}>
                <Caption1>Preview</Caption1>
                <Input
                    size={searchBarSize}
                    appearance={
                        searchBarAppearance === "auto"
                            ? contextBridge.themeShouldUseDarkColors()
                                ? "filled-darker"
                                : "filled-lighter"
                            : searchBarAppearance
                    }
                    placeholder={searchBarPlaceholderText}
                />
            </div>
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
                        />
                    </div>
                }
            />
        </SettingGroup>
    );
};
