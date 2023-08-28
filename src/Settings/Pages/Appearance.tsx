import { Dropdown, Option, Switch } from "@fluentui/react-components";
import { useContext } from "react";
import { useContextBridge, useSetting } from "../../Hooks";
import {
    PREFERRED_DARK_THEME_NAME_SETTING_KEY,
    PREFERRED_LIGHT_THEME_NAME_SETTING_KEY,
    PREFERRED_THEME_NAME_SETTING_KEY,
    SYNC_WITH_OS_SETTING_KEY,
    ThemeName,
    getTheme,
} from "../../Theme";
import { ThemeContext } from "../../ThemeContext";
import { Section } from "../Section";
import { SectionList } from "../SectionList";

export const Appearance = () => {
    const { setTheme } = useContext(ThemeContext);
    const updateTheme = () => setTheme(getTheme(useContextBridge()));

    const { value: syncWithOs, updateValue: setSyncWithOs } = useSetting(SYNC_WITH_OS_SETTING_KEY, true, updateTheme);

    const { value: preferredThemeName, updateValue: setPreferredThemeName } = useSetting<ThemeName>(
        PREFERRED_THEME_NAME_SETTING_KEY,
        "Web Dark",
        updateTheme,
    );

    const { value: preferredLightThemeName, updateValue: setPreferredLightThemeName } = useSetting<ThemeName>(
        PREFERRED_LIGHT_THEME_NAME_SETTING_KEY,
        "Web Light",
        updateTheme,
    );

    const { value: preferredDarkThemeName, updateValue: setPreferredDarkThemeName } = useSetting<ThemeName>(
        PREFERRED_DARK_THEME_NAME_SETTING_KEY,
        "Web Dark",
        updateTheme,
    );

    return (
        <SectionList>
            <Section>
                <label id={SYNC_WITH_OS_SETTING_KEY}>Sync Theme with OS</label>
                <Switch
                    aria-labelledby={SYNC_WITH_OS_SETTING_KEY}
                    checked={syncWithOs}
                    onChange={(_, { checked }) => setSyncWithOs(checked)}
                />
            </Section>
            <Section>
                <label id={PREFERRED_THEME_NAME_SETTING_KEY}>Preferred Theme</label>
                <Dropdown
                    aria-labelledby={PREFERRED_THEME_NAME_SETTING_KEY}
                    value={preferredThemeName}
                    onOptionSelect={(_, { optionValue }) =>
                        optionValue && setPreferredThemeName(optionValue as ThemeName)
                    }
                    disabled={syncWithOs}
                >
                    <Option value="Web Light">Web Light</Option>
                    <Option value="Web Dark">Web Dark</Option>
                    <Option value="Teams Light">Teams Light</Option>
                    <Option value="Teams Dark">Teams Dark</Option>
                </Dropdown>
            </Section>
            <Section>
                <label id={PREFERRED_LIGHT_THEME_NAME_SETTING_KEY}>Preferred Light Theme</label>
                <Dropdown
                    aria-labelledby={PREFERRED_LIGHT_THEME_NAME_SETTING_KEY}
                    value={preferredLightThemeName}
                    onOptionSelect={(_, { optionValue }) =>
                        optionValue && setPreferredLightThemeName(optionValue as ThemeName)
                    }
                    disabled={!syncWithOs}
                >
                    <Option value="Web Light">Web Light</Option>
                    <Option value="Teams Light">Teams Light</Option>
                </Dropdown>
            </Section>
            <Section>
                <label id={PREFERRED_DARK_THEME_NAME_SETTING_KEY}>Preferred Dark Theme</label>
                <Dropdown
                    aria-labelledby={PREFERRED_DARK_THEME_NAME_SETTING_KEY}
                    value={preferredDarkThemeName}
                    onOptionSelect={(_, { optionValue }) =>
                        optionValue && setPreferredDarkThemeName(optionValue as ThemeName)
                    }
                    disabled={!syncWithOs}
                >
                    <Option value="Web Dark">Web Dark</Option>
                    <Option value="Teams Dark">Teams Dark</Option>
                </Dropdown>
            </Section>
        </SectionList>
    );
};
