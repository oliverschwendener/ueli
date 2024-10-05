import { SettingGroup } from "@Core/Settings/SettingGroup";
import { SettingGroupList } from "../../SettingGroupList";
import { Autostart } from "./Autostart";
import { DockSettings } from "./DockSettings";
import { HotKey } from "./HotKey";
import { Language } from "./Language";
import { SearchHistory } from "./SearchHistory";
import { UrlImageGenerator } from "./UrlImageGenerator";

export const General = () => {
    return (
        <SettingGroupList>
            <SettingGroup title="General">
                <Language />
                <HotKey />
                <Autostart />
                <DockSettings />
            </SettingGroup>
            <SettingGroup title="Search History">
                <SearchHistory />
            </SettingGroup>
            <SettingGroup title="Icons">
                <UrlImageGenerator />
            </SettingGroup>
        </SettingGroupList>
    );
};
