import { useSetting } from "@Core/Hooks";
import { Field, Switch } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const HideWindowOnBlur = () => {
    const { t } = useTranslation();

    const { value: hideWindowOnBlur, updateValue: setHideWindowOnBlur } = useSetting({
        key: "window.hideWindowOnBlur",
        defaultValue: true,
    });

    return (
        <Field label={t("hideWindowOnBlur", { ns: "settingsWindow" })}>
            <Switch checked={hideWindowOnBlur} onChange={(_, { checked }) => setHideWindowOnBlur(checked)} />
        </Field>
    );
};
