import { useSetting } from "@Core/Hooks";
import { Field, Switch } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const StartHidden = () => {
    const { t } = useTranslation();

    const { value: startHidden, updateValue: setStartHidden } = useSetting({
        key: "general.startHidden",
        defaultValue: false,
    });

    return (
        <Field label={t("startHidden", { ns: "settingsGeneral" })}>
            <Switch checked={startHidden} onChange={(_, { checked }) => setStartHidden(checked)} />
        </Field>
    );
};
