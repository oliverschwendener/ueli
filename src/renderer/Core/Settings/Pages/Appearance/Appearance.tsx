import { useSetting } from "@Core/Hooks";
import { getAvailableColorModes, getAvailableThemes } from "@Core/Theme";
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
    const availableColorModes = getAvailableColorModes();

    const { value: themeName, updateValue: setThemeName } = useSetting<string>({
        key: "appearance.themeName",
        defaultValue: "Fluent UI Web",
    });

    const { value: colorMode, updateValue: setColorMode } = useSetting<string>({
        key: "appearance.colorMode",
        defaultValue: "system",
    });

    const updateTheme = (themeName: string) => {
        setThemeName(themeName);
    };

    const updateColorMode = (mode: string) => {
        setColorMode(mode);
    };

    return (
        <SettingGroupList>
            <SearchBarSettings />
            <SettingGroup title="Colors">
                <Setting
                    label={t("themeName")}
                    control={
                        <Dropdown
                            value={themeName}
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
                <Setting
                    label={t("colorMode")}
                    control={
                        <Dropdown
                            value={t("colorMode." + colorMode)}
                            onOptionSelect={(_, { optionValue }) => optionValue && updateColorMode(optionValue)}
                            selectedOptions={[colorMode]}
                        >
                            {availableColorModes.map((colorMode: string | undefined) => (
                                <Option
                                    key={`color-mode-option-${colorMode}`}
                                    value={colorMode}
                                    text={t("colorMode." + colorMode)}
                                >
                                    {t("colorMode." + colorMode)}
                                </Option>
                            ))}
                        </Dropdown>
                    }
                />
            </SettingGroup>
        </SettingGroupList>
    );
};
