import { useSetting } from "@Core/Hooks";
import { Dropdown, Field, Option } from "@fluentui/react-components";
import { Virtualizer, useStaticVirtualizerMeasure } from "@fluentui/react-components/unstable";

export const Vibrancy = () => {
    const { value: vibrancy, updateValue: setVibrancy } = useSetting({ key: "window.vibrancy", defaultValue: "None" });

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
                        <Option key={`window-vibrancy-option-${vibrancyOptions[i]}`} value={vibrancyOptions[i]}>
                            {vibrancyOptions[i]}
                        </Option>
                    )}
                </Virtualizer>
            </Dropdown>
        </Field>
    );
};
