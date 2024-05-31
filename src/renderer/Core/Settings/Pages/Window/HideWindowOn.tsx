import { useSetting } from "@Core/Hooks";
import { Dropdown, Field, Option } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const HideWindowOn = () => {
    const { t } = useTranslation();
    const ns = "settingsWindow";

    const { value: hideWindowOn, updateValue: setHideWindowOn } = useSetting({
        key: "window.hideWindowOn",
        defaultValue: ["blur"],
    });

    const options = ["blur", "afterInvocation"];

    return (
        <Field label={`${t("hideWindowOn", { ns: "settingsWindow" })}:`}>
            <Dropdown
                selectedOptions={hideWindowOn}
                value={hideWindowOn.map((o) => t(`hideWindowOn.${o}`, { ns })).join(", ")}
                onOptionSelect={(_, { selectedOptions }) => setHideWindowOn(selectedOptions)}
                multiselect
                placeholder={t("hideWindow.placeholder", { ns })}
            >
                {options.map((option) => (
                    <Option key={option} value={option}>
                        {t(`hideWindowOn.${option}`, { ns })}
                    </Option>
                ))}
            </Dropdown>
        </Field>
    );
};
