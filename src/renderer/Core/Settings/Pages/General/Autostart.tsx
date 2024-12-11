import { Setting } from "@Core/Settings/Setting";
import { Switch } from "@fluentui/react-components";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const Autostart = () => {
    const { t } = useTranslation("settingsGeneral");

    const [autostartIsEnabled, setAutostartIsEnabled] = useState<boolean>(window.ContextBridge.autostartIsEnabled());

    const updateAutostartSettings = (autostartIsEnabled: boolean) => {
        window.ContextBridge.autostartSettingsChanged(autostartIsEnabled);
        setAutostartIsEnabled(autostartIsEnabled);
    };

    return (
        <Setting
            label={t("autostart")}
            description={t("autostartDescription")}
            control={
                <Switch checked={autostartIsEnabled} onChange={(_, { checked }) => updateAutostartSettings(checked)} />
            }
        />
    );
};
