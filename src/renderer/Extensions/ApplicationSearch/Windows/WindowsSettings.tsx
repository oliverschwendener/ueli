import { useExtensionSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { SettingGroup } from "@Core/Settings/SettingGroup";
import { SettingGroupList } from "@Core/Settings/SettingGroupList";
import { Switch } from "@fluentui/react-components";
import { FileExtensions } from "./FileExtensions";
import { Folders } from "./Folders";

export const WindowsSettings = () => {
    const { value: includeWindowsStoreApps, updateValue: setIncludeWindowsStoreApps } = useExtensionSetting<boolean>({
        extensionId: "ApplicationSearch",
        key: "includeWindowsStoreApps",
    });

    return (
        <SettingGroupList>
            <SettingGroup title="General">
                <Setting
                    label="Include Apps from Windows Store"
                    control={
                        <Switch
                            checked={includeWindowsStoreApps}
                            onChange={(_, { checked }) => setIncludeWindowsStoreApps(checked)}
                        />
                    }
                />
            </SettingGroup>
            <SettingGroup title="Folders">
                <Folders />
            </SettingGroup>
            <SettingGroup title="File Extensions">
                <FileExtensions />
            </SettingGroup>
        </SettingGroupList>
    );
};
