import { Dropdown, Option } from "@fluentui/react-components";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useContextBridge, useSetting } from "../../Hooks";
import { getAvailableThemes, getTheme } from "../../Theme";
import { ThemeContext } from "../../ThemeContext";
import { Section } from "../Section";
import { SectionList } from "../SectionList";
import { ThemeOption } from "./ThemeOption";

export const Appearance = () => {
    const { t } = useTranslation();
    const { contextBridge } = useContextBridge();
    const { setTheme } = useContext(ThemeContext);

    const availableThemes = getAvailableThemes();

    const updateTheme = () => setTheme(getTheme(contextBridge));

    const { value: themeName, updateValue: setThemeName } = useSetting<string>(
        "appearance.themeName",
        "Ueli",
        updateTheme,
    );

    return (
        <SectionList>
            <Section>
                <label id="appearance.themeName">{t("settingsAppearance.themeName")}</label>
                <Dropdown
                    aria-labelledby="appearance.themeName"
                    value={themeName}
                    onOptionSelect={(_, { optionValue }) => optionValue && setThemeName(optionValue)}
                >
                    {availableThemes.map(({ name, accentColors }) => (
                        <Option key={`theme-option-${name}`} value={name} text={name}>
                            <ThemeOption
                                themeName={name}
                                accentColor={
                                    contextBridge.themeShouldUseDarkColors() ? accentColors.dark : accentColors.light
                                }
                            />
                        </Option>
                    ))}
                </Dropdown>
            </Section>
        </SectionList>
    );
};
