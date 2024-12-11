import { SettingGroup } from "@Core/Settings/SettingGroup";
import { SettingGroupList } from "../../SettingGroupList";
import { Autostart } from "./Autostart";
import { CustomWebBrowser } from "./CustomWebBrowser";
import { DockSettings } from "./DockSettings";
import { HotkeySettings } from "./HotKey";
import { Language } from "./Language";
import { SearchHistory } from "./SearchHistory";
import { UrlImageGenerator } from "./UrlImageGenerator";

export const General = () => {
    const operatingSystem = window.ContextBridge.getOperatingSystem();

    return (
        <SettingGroupList>
            <SettingGroup title="General">
                <Language />
                <Autostart />
                {operatingSystem === "macOS" && <DockSettings />}
            </SettingGroup>
            <HotkeySettings />
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
