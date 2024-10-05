import { useContextBridge, useSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { Switch } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

/**
 * This is a wrapper component around the DockSettingsContent component
 * to avoid using the contextBridge hook for the OS check in the GeneralSettings component.
 */
export const DockSettings = () => {
    const {
        contextBridge: { getOperatingSystem },
    } = useContextBridge();
    if (getOperatingSystem() !== "macOS") {
        return null;
    }

    return <DockSettingsContent />;
};

const DockSettingsContent = () => {
    const { t } = useTranslation("settingsGeneral");
    const { contextBridge } = useContextBridge();

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
