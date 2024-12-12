import { useSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { Switch } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const DockSettings = () => {
    const { t } = useTranslation("settingsGeneral");

    const { value: showAppIconInDock, updateValue: setShowAppIconInDock } = useSetting<boolean>({
        key: "appearance.showAppIconInDock",
        defaultValue: false,
    });

    const updateShowAppIconInDock = async (value: boolean) => {
        await window.ContextBridge.updateSettingValue("appearance.showAppIconInDock", value);
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
