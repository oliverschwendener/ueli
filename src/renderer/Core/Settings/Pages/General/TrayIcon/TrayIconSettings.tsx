import type { OperatingSystem } from "@common/Core";
import { useSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { SettingGroup } from "@Core/Settings/SettingGroup";
import { Switch } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const TrayIconSettings = () => {
    const operatingSystem = window.ContextBridge.getOperatingSystem();

    const { t } = useTranslation("settingsGeneral");

    const { value: showTrayIcon, updateValue: setShowTrayIcon } = useSetting({
        key: "general.tray.showIcon",
        defaultValue: true,
    });

    const groupTitles: Record<OperatingSystem, string> = {
        Linux: t("trayIcon[Linux]"),
        macOS: t("trayIcon[macOS]"),
        Windows: t("trayIcon[Windows]"),
    };

    const switchLabels: Record<OperatingSystem, string> = {
        Linux: t("trayIconShow[Linux]"),
        macOS: t("trayIconShow[macOS]"),
        Windows: t("trayIconShow[Windows]"),
    };

    return (
        <SettingGroup title={groupTitles[operatingSystem]}>
            <Setting
                label={switchLabels[operatingSystem]}
                control={<Switch checked={showTrayIcon} onChange={(_, { checked }) => setShowTrayIcon(checked)} />}
            />
        </SettingGroup>
    );
};
