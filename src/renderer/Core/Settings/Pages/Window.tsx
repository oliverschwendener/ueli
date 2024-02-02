import { Dropdown, Field, Option, Slider, Switch } from "@fluentui/react-components";
import { Virtualizer, useStaticVirtualizerMeasure } from "@fluentui/react-components/unstable";
import { useTranslation } from "react-i18next";
import { useContextBridge, useSetting } from "../../Hooks";
import { Section } from "../Section";
import { SectionList } from "../SectionList";

export const Window = () => {
    const { contextBridge } = useContextBridge();
    const { t } = useTranslation();
    const ns = "settingsWindow";

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

    const { value: acrylicOpacity, updateValue: setAcrylicOpacity } = useSetting("window.acrylicOpacity", 0.6);

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

    const { virtualizerLength, bufferItems, bufferSize, scrollRef } = useStaticVirtualizerMeasure({
        defaultItemSize: 20,
        direction: "vertical",
    });

    return (
        <SectionList>
            <Section>
                <Field label={t("hideWindowOnBlur", { ns })}>
                    <Switch
                        aria-labelledby="window.hideWindowOnblur"
                        checked={hideWindowOnBlur}
                        onChange={(_, { checked }) => setHideWindowOnBlur(checked)}
                    />
                </Field>
            </Section>

            <Section>
                <Field label={t("hideWindowAfterExecution", { ns })}>
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

            {backgroundMaterial === "Acrylic" ? (
                <Section>
                    <Field label={`Opacity: ${acrylicOpacity}`}>
                        <Slider
                            min={0}
                            max={1}
                            step={0.05}
                            value={acrylicOpacity}
                            onChange={(_, { value }) => setAcrylicOpacity(value)}
                        />
                    </Field>
                </Section>
            ) : null}

            {operatingSystem === "macOS" ? (
                <Section>
                    <Field label="Vibrancy">
                        <Dropdown
                            value={vibrancy}
                            onOptionSelect={(_, { optionValue }) => optionValue && setVibrancy(optionValue)}
                            listbox={{ ref: scrollRef, style: { maxHeight: 145 } }}
                        >
                            <Virtualizer
                                numItems={vibrancyOptions.length}
                                virtualizerLength={virtualizerLength}
                                bufferItems={bufferItems}
                                bufferSize={bufferSize}
                                itemSize={20}
                            >
                                {(i) => (
                                    <Option
                                        key={`window-vibrancy-option-${vibrancyOptions[i]}`}
                                        value={vibrancyOptions[i]}
                                    >
                                        {vibrancyOptions[i]}
                                    </Option>
                                )}
                            </Virtualizer>
                        </Dropdown>
                    </Field>
                </Section>
            ) : null}
        </SectionList>
    );
};
