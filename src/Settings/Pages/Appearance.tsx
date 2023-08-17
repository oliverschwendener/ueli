import { Dropdown, Option, Switch } from "@fluentui/react-components";
import { useContext, useState } from "react";
import {
    PREFERRED_DARK_THEME_SETTING_KEY,
    PREFERRED_LIGHT_THEME_SETTING_KEY,
    PREFERRED_THEME_SETTING_KEY,
    SYNC_WITH_OS_SETTING_KEY,
    ThemeName,
    getTheme,
} from "../../Theme";
import { ThemeContext } from "../../ThemeContext";
import { SectionList } from "../SectionList";
import { Section } from "../Section";

export const Appearance = () => {
    const { setTheme: updateTheme } = useContext(ThemeContext);

    const [syncWithOs, setSyncWithOs] = useState<boolean>(
        window.ContextBridge.getSettingByKey(SYNC_WITH_OS_SETTING_KEY, true),
    );

    const [preferredTheme, setPreferredTheme] = useState<ThemeName>(
        window.ContextBridge.getSettingByKey<ThemeName>(PREFERRED_THEME_SETTING_KEY, "Web Light"),
    );

    const [preferredLightTheme, setPreferredLightTheme] = useState<ThemeName>(
        window.ContextBridge.getSettingByKey<ThemeName>(PREFERRED_LIGHT_THEME_SETTING_KEY, "Web Light"),
    );

    const [preferredDarkTheme, setPreferredDarkTheme] = useState<ThemeName>(
        window.ContextBridge.getSettingByKey<ThemeName>(PREFERRED_DARK_THEME_SETTING_KEY, "Web Dark"),
    );

    const saveSetting = async <T,>(key: string, value: T) => {
        await window.ContextBridge.updateSettingByKey(key, value);
        updateTheme(getTheme());
    };

    return (
        <SectionList>
            <Section>
                <label id={SYNC_WITH_OS_SETTING_KEY}>Sync Theme with OS</label>
                <Switch
                    aria-labelledby={SYNC_WITH_OS_SETTING_KEY}
                    checked={syncWithOs}
                    onChange={(_, { checked }) => {
                        setSyncWithOs(checked);
                        saveSetting(SYNC_WITH_OS_SETTING_KEY, checked);
                    }}
                />
            </Section>
            <Section>
                <label id={PREFERRED_THEME_SETTING_KEY}>Preferred Theme</label>
                <Dropdown
                    aria-labelledby={PREFERRED_THEME_SETTING_KEY}
                    value={preferredTheme}
                    onOptionSelect={(_, { optionValue }) => {
                        if (optionValue) {
                            setPreferredTheme(optionValue as ThemeName);
                            saveSetting(PREFERRED_THEME_SETTING_KEY, optionValue as ThemeName);
                        }
                    }}
                    disabled={syncWithOs}
                >
                    <Option value="Web Light">Web Light</Option>
                    <Option value="Web Dark">Web Dark</Option>
                    <Option value="Teams Light">Teams Light</Option>
                    <Option value="Teams Dark">Teams Dark</Option>
                </Dropdown>
            </Section>
            <Section>
                <label id={PREFERRED_LIGHT_THEME_SETTING_KEY}>Preferred Light Theme</label>
                <Dropdown
                    aria-labelledby={PREFERRED_LIGHT_THEME_SETTING_KEY}
                    value={preferredLightTheme}
                    onOptionSelect={(_, { optionValue }) => {
                        if (optionValue) {
                            setPreferredLightTheme(optionValue as ThemeName);
                            saveSetting(PREFERRED_LIGHT_THEME_SETTING_KEY, optionValue as ThemeName);
                        }
                    }}
                    disabled={!syncWithOs}
                >
                    <Option value="Web Light">Web Light</Option>
                    <Option value="Teams Light">Teams Light</Option>
                </Dropdown>
            </Section>
            <Section>
                <label id={PREFERRED_DARK_THEME_SETTING_KEY}>Preferred Dark Theme</label>
                <Dropdown
                    aria-labelledby={PREFERRED_DARK_THEME_SETTING_KEY}
                    value={preferredDarkTheme}
                    onOptionSelect={(_, { optionValue }) => {
                        if (optionValue) {
                            setPreferredDarkTheme(optionValue as ThemeName);
                            saveSetting(PREFERRED_DARK_THEME_SETTING_KEY, optionValue as ThemeName);
                        }
                    }}
                    disabled={!syncWithOs}
                >
                    <Option value="Web Dark">Web Dark</Option>
                    <Option value="Teams Dark">Teams Dark</Option>
                </Dropdown>
            </Section>
        </SectionList>
    );
};
