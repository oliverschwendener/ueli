import type { ContextBridge } from "@common/Core";
import { useContextBridge, useSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { Switch } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

/**
 * This is a wrapper component around the DockSettingsContent component
 * to avoid using the contextBridge for the OS check in the GeneralSettings component.
 */
export const DockSettings = () => {
    const { contextBridge } = useContextBridge();
    if (contextBridge.getOperatingSystem() !== "macOS") {
        return null;
    }

    // TODO(benjamin-kraatz): is that a good idea?
    return <DockSettingsContent contextBridge={contextBridge} />;
};

const DockSettingsContent = ({ contextBridge }: { contextBridge: ContextBridge }) => {
    const { t } = useTranslation("settingsGeneral");

    const { value: showAppIconInDock, updateValue: setShowAppIconInDock } = useSetting<boolean>({
        key: "appearance.showAppIconInDock",
        defaultValue: false,
    });

    const updateShowAppIconInDock = async (value: boolean) => {
        await contextBridge.updateSettingValue("appearance.showAppIconInDock", value);
        setShowAppIconInDock(value);
    };

    return (
        <Setting
            label={t("showAppIconInDock")}
            control={
                <Switch checked={showAppIconInDock} onChange={(_, { checked }) => updateShowAppIconInDock(checked)} />
            }
        />
    );
};
