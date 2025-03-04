import { SettingGroup } from "@Core/Settings/SettingGroup";
import { SettingGroupList } from "@Core/Settings/SettingGroupList";
import { useTranslation } from "react-i18next";
import { Autostart } from "./Autostart";
import { Configuration } from "./Configuration";
import { CustomWebBrowser } from "./CustomWebBrowser";
import { DockSettings } from "./DockSettings";
import { HotkeySettings } from "./HotKey";
import { Language } from "./Language";
import { SearchHistory } from "./SearchHistory";
import { UrlImageGenerator } from "./UrlImageGenerator";

export const General = () => {
    const operatingSystem = window.ContextBridge.getOperatingSystem();
    const { t } = useTranslation("settingsGeneral");

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
            <SettingGroup title={t("configuration")}>
                <Configuration />
            </SettingGroup>
        </SettingGroupList>
    );
};
