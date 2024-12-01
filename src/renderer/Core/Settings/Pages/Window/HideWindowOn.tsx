import { useSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { Dropdown, Option } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const HideWindowOn = () => {
    const { t } = useTranslation("settingsWindow");

    const { value: hideWindowOn, updateValue: setHideWindowOn } = useSetting({
        key: "window.hideWindowOn",
        defaultValue: ["blur", "afterInvocation", "escapePressed"],
    });

    const options = ["blur", "afterInvocation", "escapePressed"];

    return (
        <Setting
            label={`${t("hideWindowOn")}`}
            control={
                <Dropdown
                    selectedOptions={hideWindowOn}
                    value={hideWindowOn.map((o) => t(`hideWindowOn.${o}`)).join(", ")}
                    onOptionSelect={(_, { selectedOptions }) => setHideWindowOn(selectedOptions)}
                    multiselect
                    placeholder={t("hideWindow.placeholder")}
                >
                    {options.map((option) => (
                        <Option key={option} value={option}>
                            {t(`hideWindowOn.${option}`)}
                        </Option>
                    ))}
                </Dropdown>
            }
        />
    );
};
