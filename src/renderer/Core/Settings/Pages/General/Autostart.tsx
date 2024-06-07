import { useContextBridge } from "@Core/Hooks";
import { Switch } from "@fluentui/react-components";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const Autostart = () => {
    const { t } = useTranslation("settingsGeneral");
    const { contextBridge } = useContextBridge();

    const [autostartIsEnabled, setAutostartIsEnabled] = useState<boolean>(contextBridge.autostartIsEnabled());

    const updateAutostartSettings = (autostartIsEnabled: boolean) => {
        contextBridge.autostartSettingsChanged(autostartIsEnabled);
        setAutostartIsEnabled(autostartIsEnabled);
    };

    return (
        <Switch
            label={t("autostart")}
            checked={autostartIsEnabled}
            onChange={(_, { checked }) => updateAutostartSettings(checked)}
        />
    );
};
