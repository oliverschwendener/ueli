import { Dropdown, Option, Switch } from "@fluentui/react-components";
import { Virtualizer, useStaticVirtualizerMeasure } from "@fluentui/react-components/unstable";
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

    const { virtualizerLength, bufferItems, bufferSize, scrollRef } = useStaticVirtualizerMeasure({
        defaultItemSize: 32,
        direction: "vertical",
    });

    const backgroundMaterialOptions = ["Acrylic", "Mica", "None", "Tabbed"];

    const vibrancyOptions = [
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
                        {backgroundMaterialOptions.map((b) => (
                            <Option key={`background-material-option-${b}`} value={b}>
                                {b}
                            </Option>
                        ))}
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
                        listbox={{ ref: scrollRef, style: { maxHeight: 146 } }}
                    >
                        <Virtualizer
                            numItems={vibrancyOptions.length}
                            virtualizerLength={virtualizerLength}
                            bufferItems={bufferItems}
                            bufferSize={bufferSize}
                            itemSize={32}
                        >
                            {(index) => {
                                return (
                                    <Option
                                        aria-posinset={index}
                                        aria-setsize={vibrancyOptions.length}
                                        key={`window-vibrancy-option-${index}`}
                                        value={vibrancyOptions[index]}
                                    >
                                        {vibrancyOptions[index]}
                                    </Option>
                                );
                            }}
                        </Virtualizer>
                    </Dropdown>
                </Section>
            ) : null}
        </SectionList>
    );
};
