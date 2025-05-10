import { useSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { SettingGroup } from "@Core/Settings/SettingGroup";
import { Switch } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const TrayIconSettings = () => {
    const operatingSystem = window.ContextBridge.getOperatingSystem();
    const { t } = useTranslation("settingsGeneral");

    const { value: showTrayIcon, updateValue: setShowTrayIcon } = useSetting({
        key: "trayIcon.show",
        defaultValue: true,
    });

    return (
        <SettingGroup title={t(`trayIcon[${operatingSystem}]`)}>
            <Setting
                label={t(`trayIconShow[${operatingSystem}]`)}
                control={<Switch checked={showTrayIcon} onChange={(_, { checked }) => setShowTrayIcon(checked)} />}
            />
        </SettingGroup>
    );
};
