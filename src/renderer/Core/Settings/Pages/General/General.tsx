import { SettingGroup } from "@Core/Settings/SettingGroup";
import { SettingGroupList } from "@Core/Settings/SettingGroupList";
import { useTranslation } from "react-i18next";
import { Autostart } from "./Autostart";
import { CustomWebBrowser } from "./CustomWebBrowser";
import { DockSettings } from "./DockSettings";
import { HotkeySettings } from "./HotKey";
import { ImportExport } from "./ImportExport";
import { Language } from "./Language";
import { PreserveUserInput } from "./PreserveUserInput";
import { SearchHistory } from "./SearchHistory";
import { SetCustomSettingsFilePath } from "./SetCustomSettingsFilePath";
import { TrayIconSettings } from "./TrayIcon";
import { UrlImageGenerator } from "./UrlImageGenerator";

export const General = () => {
    const operatingSystem = window.ContextBridge.getOperatingSystem();
    const { t } = useTranslation("settingsGeneral");

    return (
        <SettingGroupList>
            <SettingGroup title={t("general")}>
                <Language />
                <Autostart />
                {operatingSystem === "macOS" && <DockSettings />}
                <PreserveUserInput />
            </SettingGroup>
            <TrayIconSettings />
            <HotkeySettings />
            <SettingGroup title={t("searchHistory")}>
                <SearchHistory />
            </SettingGroup>
            <SettingGroup title={t("icons")}>
                <UrlImageGenerator />
            </SettingGroup>
            {operatingSystem !== "Linux" && <CustomWebBrowser />}
            <SettingGroup title={t("importExport")}>
                <ImportExport />
            </SettingGroup>
            <SettingGroup title={t("customSettingsFilePath")}>
                <SetCustomSettingsFilePath />
            </SettingGroup>
        </SettingGroupList>
    );
};
