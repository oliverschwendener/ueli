import { useSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { Dropdown, Option } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const ScrollBehavior = () => {
    const { t } = useTranslation("settingsWindow");

    const scrollBehaviors = {
        auto: t("scrollBehavior.auto"),
        smooth: t("scrollBehavior.smooth"),
        instant: t("scrollBehavior.instant"),
    };

    const { value: scrollBehavior, updateValue: setScrollBehavior } = useSetting<ScrollBehavior>({
        key: "window.scrollBehavior",
        defaultValue: "smooth",
    });

    return (
        <Setting
            label={t("scrollBehavior")}
            control={
                <Dropdown
                    value={scrollBehaviors[scrollBehavior]}
                    selectedOptions={[scrollBehavior]}
                    onOptionSelect={(_, { optionValue }) =>
                        optionValue && setScrollBehavior(optionValue as ScrollBehavior)
                    }
                >
                    {Object.entries(scrollBehaviors).map(([Behavior, name]) => (
                        <Option key={Behavior} value={Behavior} text={name}>
                            {name}
                        </Option>
                    ))}
                </Dropdown>
            }
        />
    );
};
