import { Dropdown, Option } from "@fluentui/react-components";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useContextBridge, useSetting } from "../../Hooks";
import { getTheme } from "../../Theme";
import { ThemeContext } from "../../ThemeContext";
import { Section } from "../Section";
import { SectionList } from "../SectionList";

export const Appearance = () => {
    const { t } = useTranslation();
    const { contextBridge } = useContextBridge();
    const { setTheme } = useContext(ThemeContext);

    const updateTheme = () => setTheme(getTheme(contextBridge));

    const { value: themeName, updateValue: setThemeName } = useSetting<string>(
        "appearance.themeName",
        "Ueli",
        updateTheme,
    );

    return (
        <SectionList>
            <Section></Section>
            <Section>
                <label id="appearance.themeName">{t("settingsAppearance.themeName")}</label>
                <Dropdown
                    aria-labelledby="appearance.themeName"
                    value={themeName}
                    onOptionSelect={(_, { optionValue }) => optionValue && setThemeName(optionValue)}
                >
                    <Option value="Microsoft Teams">Microsoft Teams</Option>
                    <Option value="Ueli">Ueli</Option>
                    <Option value="Fluent UI Web">Fluent UI Web</Option>
                </Dropdown>
            </Section>
        </SectionList>
    );
};
