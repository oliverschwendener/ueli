import { SettingGroup } from "@Core/Settings/SettingGroup";
import { SettingGroupList } from "../../SettingGroupList";
import { Logs } from "./Logs";
import { ResetSettings } from "./ResetSettings";

export const Debug = () => {
    return (
        <SettingGroupList>
            <SettingGroup title="Repair">
                <ResetSettings />
            </SettingGroup>
            <SettingGroup title="Logs">
                <Logs />
            </SettingGroup>
        </SettingGroupList>
    );
};
