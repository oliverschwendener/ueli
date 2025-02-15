import { useExtensionSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { SettingGroup } from "@Core/Settings/SettingGroup";
import { SettingGroupList } from "@Core/Settings/SettingGroupList";
import { Switch } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { FileExtensions } from "./FileExtensions";
import { Folders } from "./Folders";

export const WindowsSettings = () => {
    const { t } = useTranslation("extension[ApplicationSearch]");

    const { value: includeWindowsStoreApps, updateValue: setIncludeWindowsStoreApps } = useExtensionSetting<boolean>({
        extensionId: "ApplicationSearch",
        key: "includeWindowsStoreApps",
    });

    return (
        <SettingGroupList>
            <SettingGroup title={t("general")}>
                <Setting
                    label={t("includeAppsFromWindowsStore")}
                    control={
                        <Switch
                            checked={includeWindowsStoreApps}
                            onChange={(_, { checked }) => setIncludeWindowsStoreApps(checked)}
                        />
                    }
                />
            </SettingGroup>
            <SettingGroup title={t("folders")}>
                <Folders />
            </SettingGroup>
            <SettingGroup title={t("fileExtensions")}>
                <FileExtensions />
            </SettingGroup>
        </SettingGroupList>
    );
};
