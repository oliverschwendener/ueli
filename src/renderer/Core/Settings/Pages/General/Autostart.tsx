import { useContextBridge } from "@Core/Hooks";
import { Field, Switch } from "@fluentui/react-components";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const Autostart = () => {
    const { t } = useTranslation();
    const { contextBridge } = useContextBridge();

    const [autostartIsEnabled, setAutostartIsEnabled] = useState<boolean>(contextBridge.autostartIsEnabled());

    const updateAutostartSettings = (autostartIsEnabled: boolean) => {
        contextBridge.autostartSettingsChanged(autostartIsEnabled);
        setAutostartIsEnabled(autostartIsEnabled);
    };

    return (
        <Field label={t("autostart", { ns: "settingsGeneral" })}>
            <Switch checked={autostartIsEnabled} onChange={(_, { checked }) => updateAutostartSettings(checked)} />
        </Field>
    );
};
