import { useSetting } from "@Core/Hooks";
import { Field, Switch } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const AlwaysCenter = () => {
    const { t } = useTranslation();

    const { value: alwaysCenter, updateValue: setAlwaysCenter } = useSetting({
        key: "window.alwaysCenter",
        defaultValue: false,
    });

    return (
        <Field label={t("alwaysCenter", { ns: "settingsWindow" })}>
            <Switch checked={alwaysCenter} onChange={(_, { checked }) => setAlwaysCenter(checked)} />
        </Field>
    );
};
