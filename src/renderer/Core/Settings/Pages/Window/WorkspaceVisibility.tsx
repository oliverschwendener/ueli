import { Setting } from "@Core/Settings/Setting";
import { Switch } from "@fluentui/react-components";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const WorkspaceVisibility = () => {
    const { t } = useTranslation("settingsWindow");

    const [visibleOnAllWorkspaces, setVisibleOnAllWorkspaces] = useState<boolean>(
        window.ContextBridge.getSettingValue("window.visibleOnAllWorkspaces", false),
    );

    const updateVisibleOnAllWorkspaces = async (value: boolean) => {
        await window.ContextBridge.updateSettingValue("window.visibleOnAllWorkspaces", value);
        setVisibleOnAllWorkspaces(value);
    };

    return (
        <Setting
            label={t("visibleOnAllWorkspaces")}
            control={
                <Switch
                    checked={visibleOnAllWorkspaces}
                    onChange={(_, { checked }) => updateVisibleOnAllWorkspaces(checked)}
                />
            }
        />
    );
};
