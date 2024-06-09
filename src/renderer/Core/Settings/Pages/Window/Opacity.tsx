import { useSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { Slider } from "@fluentui/react-components";

export const Opacity = () => {
    const { value: acrylicOpacity, updateValue: setAcrylicOpacity } = useSetting({
        key: "window.acrylicOpacity",
        defaultValue: 0.6,
    });

    return (
        <Setting
            label={`Opacity: ${acrylicOpacity}`}
            control={
                <Slider
                    style={{ width: "50%" }}
                    min={0}
                    max={1}
                    step={0.05}
                    value={acrylicOpacity}
                    onChange={(_, { value }) => setAcrylicOpacity(value)}
                />
            }
        />
    );
};
