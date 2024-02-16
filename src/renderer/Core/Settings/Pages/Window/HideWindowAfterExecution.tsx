import { useSetting } from "@Core/Hooks";
import { Field, Switch } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const HideWindowAfterExecution = () => {
    const { t } = useTranslation();

    const { value: hideWindowAfterExecution, updateValue: setHideWindowAfterExecution } = useSetting({
        key: "window.hideWindowAfterExecution",
        defaultValue: true,
    });

    return (
        <Field label={t("hideWindowAfterExecution", { ns: "settingsWindow" })}>
            <Switch
                checked={hideWindowAfterExecution}
                onChange={(_, { checked }) => setHideWindowAfterExecution(checked)}
            />
        </Field>
    );
};
