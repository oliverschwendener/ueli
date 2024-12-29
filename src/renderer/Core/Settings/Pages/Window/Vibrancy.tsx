import { useSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { Dropdown, Option } from "@fluentui/react-components";

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

    return (
        <Setting
            label="Vibrancy"
            control={
                <Dropdown
                    value={vibrancy}
                    selectedOptions={[vibrancy]}
                    onOptionSelect={(_, { optionValue }) => optionValue && setVibrancy(optionValue)}
                >
                    {vibrancyOptions.map((vibrancyOption) => (
                        <Option key={`window-vibrancy-option-${vibrancyOption}`} value={vibrancyOption}>
                            {vibrancyOption}
                        </Option>
                    ))}
                </Dropdown>
            }
        />
    );
};
