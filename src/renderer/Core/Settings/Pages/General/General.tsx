import { SettingGroup } from "@Core/Settings/SettingGroup";
import { SettingGroupList } from "../../SettingGroupList";
import { Autostart } from "./Autostart";
import { CustomWebBrowser } from "./CustomWebBrowser";
import { DockSettings } from "./DockSettings";
import { HotKey } from "./HotKey";
import { Language } from "./Language";
import { SearchHistory } from "./SearchHistory";
import { UrlImageGenerator } from "./UrlImageGenerator";

export const General = () => {
    const operatingSystem = window.ContextBridge.getOperatingSystem();

    return (
        <SettingGroupList>
            <SettingGroup title="General">
                <Language />
                <HotKey />
                <Autostart />
                {operatingSystem === "macOS" && <DockSettings />}
            </SettingGroup>
            <SettingGroup title="Search History">
                <SearchHistory />
            </SettingGroup>
            <SettingGroup title="Icons">
                <UrlImageGenerator />
            </SettingGroup>
            {operatingSystem !== "Linux" && <CustomWebBrowser />}
        </SettingGroupList>
    );
};
