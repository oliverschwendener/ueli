import { Dropdown, Option, Switch } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { useContextBridge, useSetting } from "../../Hooks";
import { Section } from "../Section";
import { SectionList } from "../SectionList";

export const Window = () => {
    const { contextBridge } = useContextBridge();
    const { t } = useTranslation();

    const operatingSystem = contextBridge.getOperatingSystem();

    const { value: hideWindowOnBlur, updateValue: setHideWindowOnBlur } = useSetting("window.hideWindowOnBlur", true);

    const { value: hideWindowAfterExecution, updateValue: setHideWindowAfterExecution } = useSetting(
        "window.hideWindowAfterExecution",
        true,
    );

    const { value: backgroundMaterial, updateValue: setBackgroundMaterial } = useSetting(
        "window.backgroundMaterial",
        "mica",
    );

    const { value: vibrancy, updateValue: setVibrancy } = useSetting("window.vibrancy", "None");

    return (
        <SectionList>
            <Section>
                <label id="window.hideWindowOnblur">{t("settingsWindow.hideWindowOnBlur")}</label>
                <Switch
                    aria-labelledby="window.hideWindowOnblur"
                    checked={hideWindowOnBlur}
                    onChange={(_, { checked }) => setHideWindowOnBlur(checked)}
                />
            </Section>

            <Section>
                <label id="window.hideWindowAfterExecution">{t("settingsWindow.hideWindowAfterExecution")}</label>
                <Switch
                    aria-labelledby="window.hideWindowAfterExecution"
                    checked={hideWindowAfterExecution}
                    onChange={(_, { checked }) => setHideWindowAfterExecution(checked)}
                />
            </Section>

            {operatingSystem === "Windows" ? (
                <Section>
                    <label id="window.backgroundMaterial">Background material</label>
                    <Dropdown
                        aria-labelledby="window.backgroundMaterial"
                        value={backgroundMaterial}
                        onOptionSelect={(_, { optionValue }) => optionValue && setBackgroundMaterial(optionValue)}
                    >
                        <Option key="none" value="none">
                            None
                        </Option>
                        <Option key="mica" value="mica">
                            Mica
                        </Option>
                        <Option key="tabbed" value="tabbed">
                            Tabbed
                        </Option>
                        <Option key="acrylic" value="acrylic">
                            Acrylic
                        </Option>
                    </Dropdown>
                </Section>
            ) : null}

            {operatingSystem === "macOS" ? (
                <Section>
                    <label id="window.vibrancy">Vibrancy</label>
                    <Dropdown
                        aria-labelledby="window.vibrancy"
                        value={vibrancy}
                        onOptionSelect={(_, { optionValue }) => optionValue && setVibrancy(optionValue)}
                    >
                        <Option key="None" value="None">
                            None
                        </Option>
                        <Option key="titlebar" value="titlebar">
                            titlebar
                        </Option>
                        <Option key="selection" value="selection">
                            selection
                        </Option>
                        <Option key="menu" value="menu">
                            menu
                        </Option>
                        <Option key="popover" value="popover">
                            popover
                        </Option>
                        <Option key="sidebar" value="sidebar">
                            sidebar
                        </Option>
                        <Option key="header" value="header">
                            header
                        </Option>
                        <Option key="sheet" value="sheet">
                            sheet
                        </Option>
                        <Option key="window" value="window">
                            window
                        </Option>
                        <Option key="hud" value="hud">
                            hud
                        </Option>
                        <Option key="fullscreen-ui" value="fullscreen-ui">
                            fullscreen-ui
                        </Option>
                        <Option key="tooltip" value="tooltip">
                            tooltip
                        </Option>
                        <Option key="content" value="content">
                            content
                        </Option>
                        <Option key="under-window" value="under-window">
                            under-window
                        </Option>
                        <Option key="under-page" value="under-page">
                            under-page
                        </Option>
                    </Dropdown>
                </Section>
            ) : null}
        </SectionList>
    );
};
