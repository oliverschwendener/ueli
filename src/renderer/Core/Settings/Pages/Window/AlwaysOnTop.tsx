import { useSetting } from "@Core/Hooks";
import { Field, Switch } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const AlwaysOnTop = () => {
    const { t } = useTranslation();
    const { value, updateValue } = useSetting({ key: "window.alwaysOnTop", defaultValue: false });

    return (
        <Field label={t("alwaysOnTop", { ns: "settingsWindow" })}>
            <Switch checked={value} onChange={(_, { checked }) => updateValue(checked)} />
        </Field>
    );
};
