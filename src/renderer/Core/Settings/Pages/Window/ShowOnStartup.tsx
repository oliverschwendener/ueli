import { useSetting } from "@Core/Hooks";
import { Field, Switch } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const ShowOnStartup = () => {
    const { t } = useTranslation();

    const { value, updateValue } = useSetting({ key: "window.showOnStartup", defaultValue: true });

    return (
        <Field label={t("showOnStartup", { ns: "settingsWindow" })}>
            <Switch checked={value} onChange={(_, { checked }) => updateValue(checked)} />
        </Field>
    );
};
