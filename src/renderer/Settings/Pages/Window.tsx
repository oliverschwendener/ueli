import { Dropdown, Field, Option, Switch } from "@fluentui/react-components";
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
        "Mica",
    );

    const { value: vibrancy, updateValue: setVibrancy } = useSetting("window.vibrancy", "None");

    const backgroundMaterialOptions = ["Acrylic", "Mica", "None", "Tabbed"];

    const vibrancyOptions = [
        "None",
        "content",
        "fullscreen-ui",
        "header",
        "hud",
        "menu",
        "popover",
        "selection",
        "sheet",
        "sidebar",
        "titlebar",
        "tooltip",
        "under-page",
        "under-window",
        "window",
    ];

    return (
        <SectionList>
            <Section>
                <Field label={t("settingsWindow.hideWindowOnBlur")}>
                    <Switch
                        aria-labelledby="window.hideWindowOnblur"
                        checked={hideWindowOnBlur}
                        onChange={(_, { checked }) => setHideWindowOnBlur(checked)}
                    />
                </Field>
            </Section>

            <Section>
                <Field label={t("settingsWindow.hideWindowAfterExecution")}>
                    <Switch
                        aria-labelledby="window.hideWindowAfterExecution"
                        checked={hideWindowAfterExecution}
                        onChange={(_, { checked }) => setHideWindowAfterExecution(checked)}
                    />
                </Field>
            </Section>

            {operatingSystem === "Windows" ? (
                <Section>
                    <Field label="Background material">
                        <Dropdown
                            aria-labelledby="window.backgroundMaterial"
                            value={backgroundMaterial}
                            onOptionSelect={(_, { optionValue }) => optionValue && setBackgroundMaterial(optionValue)}
                        >
                            {backgroundMaterialOptions.map((b) => (
                                <Option key={`background-material-option-${b}`} value={b}>
                                    {b}
                                </Option>
                            ))}
                        </Dropdown>
                    </Field>
                </Section>
            ) : null}

            {operatingSystem === "macOS" ? (
                <Section>
                    <Field label="Vibrancy">
                        <Dropdown
                            aria-labelledby="window.vibrancy"
                            value={vibrancy}
                            onOptionSelect={(_, { optionValue }) => optionValue && setVibrancy(optionValue)}
                        >
                            {vibrancyOptions.map((v) => (
                                <Option key={`window-vibrancy-option-${v}`} value={v}>
                                    {v}
                                </Option>
                            ))}
                        </Dropdown>
                    </Field>
                </Section>
            ) : null}
        </SectionList>
    );
};
