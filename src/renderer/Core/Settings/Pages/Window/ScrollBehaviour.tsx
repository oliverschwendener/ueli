import { useSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { Dropdown, Option } from "@fluentui/react-components";

export const ScrollBehavior = () => {
    const scrollBehaviors = {
        auto: "Auto",
        smooth: "Smooth",
        instant: "Instant",
    };

    const { value: scrollBehavior, updateValue: setScrollBehavior } = useSetting<ScrollBehavior>({
        key: "window.scrollBehavior",
        defaultValue: "smooth",
    });

    return (
        <Setting
            label={"Scroll Behaviour"}
            control={
                <Dropdown
                    value={scrollBehaviors[scrollBehavior]}
                    selectedOptions={[scrollBehavior]}
                    onOptionSelect={(_, { optionValue }) =>
                        optionValue && setScrollBehavior(optionValue as ScrollBehavior)
                    }
                >
                    {Object.entries(scrollBehaviors).map(([behaviour, name]) => (
                        <Option key={behaviour} value={behaviour} text={name}>
                            {name}
                        </Option>
                    ))}
                </Dropdown>
            }
        />
    );
};
