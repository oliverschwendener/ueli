import { useContextBridge, useSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { SettingGroup } from "@Core/Settings/SettingGroup";
import { Switch } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const DockSettings = () => {
    const ns = "settingsAppearance";
    const { t } = useTranslation();

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
        <SettingGroup title={t("dock", { ns })}>
            <Setting
                label={t("showAppIconInDock", { ns })}
                control={
                    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                        <Switch
                            checked={showAppIconInDock}
                            onChange={(_, { checked }) => updateShowAppIconInDock(checked)}
                        />
                    </div>
                }
            />
        </SettingGroup>
    );
};
