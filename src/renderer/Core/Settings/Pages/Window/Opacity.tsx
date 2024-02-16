import { useSetting } from "@Core/Hooks";
import { Field, Slider } from "@fluentui/react-components";

export const Opacity = () => {
    const { value: acrylicOpacity, updateValue: setAcrylicOpacity } = useSetting({
        key: "window.acrylicOpacity",
        defaultValue: 0.6,
    });

    return (
        <Field label={`Opacity: ${acrylicOpacity}`}>
            <Slider
                min={0}
                max={1}
                step={0.05}
                value={acrylicOpacity}
                onChange={(_, { value }) => setAcrylicOpacity(value)}
            />
        </Field>
    );
};
