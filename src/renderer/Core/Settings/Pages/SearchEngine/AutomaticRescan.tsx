import { Field, Switch } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

type AutomaticRescanProps = {
    automaticRescanEnabled: boolean;
    setAutomaticRescanEnabled: (value: boolean) => void;
};

export const AutomaticRescan = ({ automaticRescanEnabled, setAutomaticRescanEnabled }: AutomaticRescanProps) => {
    const ns = "settingsSearchEngine";
    const { t } = useTranslation();

    return (
        <Field label={t("automaticRescan", { ns })}>
            <Switch
                checked={automaticRescanEnabled}
                onChange={(_, { checked }) => setAutomaticRescanEnabled(checked)}
            />
        </Field>
    );
};
