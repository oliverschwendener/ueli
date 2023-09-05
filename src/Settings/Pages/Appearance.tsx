import { Dropdown, Option, Switch } from "@fluentui/react-components";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useContextBridge, useSetting } from "../../Hooks";
import { getTheme, type ThemeName } from "../../Theme";
import { ThemeContext } from "../../ThemeContext";
import { Section } from "../Section";
import { SectionList } from "../SectionList";

export const Appearance = () => {
    const { t } = useTranslation();
    const { contextBridge } = useContextBridge();
    const { setTheme } = useContext(ThemeContext);

    const updateTheme = () => setTheme(getTheme(contextBridge));

    const { value: syncWithOs, updateValue: setSyncWithOs } = useSetting<boolean>(
        "appearance.syncWithOs",
        true,
        updateTheme,
    );

    const { value: preferredThemeName, updateValue: setPreferredThemeName } = useSetting<ThemeName>(
        "appearance.preferredThemeName",
        "Web Dark",
        updateTheme,
    );

    const { value: preferredLightThemeName, updateValue: setPreferredLightThemeName } = useSetting<ThemeName>(
        "appearance.preferredLightThemeName",
        "Web Light",
        updateTheme,
    );

    const { value: preferredDarkThemeName, updateValue: setPreferredDarkThemeName } = useSetting<ThemeName>(
        "appearance.preferredDarkThemeName",
        "Web Dark",
        updateTheme,
    );

    return (
        <SectionList>
            <Section>
                <label id="appearance.syncWithOs">{t("settingsAppearance.syncThemeWithOs")}</label>
                <Switch
                    aria-labelledby="appearance.syncWithOs"
                    checked={syncWithOs}
                    onChange={(_, { checked }) => setSyncWithOs(checked)}
                />
            </Section>
            <Section>
                <label id="appearance.customThemeEnabled">{t("settingsAppearance.preferredTheme")}</label>
                <Dropdown
                    aria-labelledby="appearance.customThemeEnabled"
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
                <label id="appearance.preferredLightThemeName">{t("settingsAppearance.preferredLightTheme")}</label>
                <Dropdown
                    aria-labelledby="appearance.preferredLightThemeName"
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
                <label id="appearance.preferredDarkThemeName">{t("settingsAppearance.preferredDarkTheme")}</label>
                <Dropdown
                    aria-labelledby="appearance.preferredDarkThemeName"
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
