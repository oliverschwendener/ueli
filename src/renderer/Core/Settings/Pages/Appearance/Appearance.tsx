import { useSetting } from "@Core/Hooks";
import { getAvailableThemes } from "@Core/Theme";
import { Dropdown, Option } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { Setting } from "../../Setting";
import { SettingGroup } from "../../SettingGroup";
import { SettingGroupList } from "../../SettingGroupList";
import { ThemeOption } from "../ThemeOption";
import { SearchBarSettings } from "./SearchBarSettings";

export const Appearance = () => {
    const { t } = useTranslation("settingsAppearance");

    const availableThemes = getAvailableThemes();

    const { value: themeName, updateValue: setThemeName } = useSetting<string>({
        key: "appearance.themeName",
        defaultValue: "Fluent UI Web",
    });
    const themes = [
        { value: "Microsoft Teams", label: "Microsoft Teams" },
        { value: "Fluent UI Web", label: "Fluent UI Web" },
    ];

    const updateTheme = (themeName: string) => {
        setThemeName(themeName);
    };

    return (
        <SettingGroupList>
            <SearchBarSettings />
            <SettingGroup title="Colors">
                <Setting
                    label={t("themeName")}
                    control={
                        <Dropdown
                            value={themes.find((t) => t.value === themeName)?.label}
                            onOptionSelect={(_, { optionValue }) => optionValue && updateTheme(optionValue)}
                            selectedOptions={[themeName]}
                        >
                            {availableThemes.map(({ name, accentColors }) => (
                                <Option key={`theme-option-${name}`} value={name} text={name}>
                                    <ThemeOption themeName={name} accentColors={accentColors} />
                                </Option>
                            ))}
                        </Dropdown>
                    }
                />
            </SettingGroup>
        </SettingGroupList>
    );
};
