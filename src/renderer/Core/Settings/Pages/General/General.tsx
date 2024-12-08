import { useContextBridge, useSetting } from "@Core/Hooks";
import { SettingGroup } from "@Core/Settings/SettingGroup";
import { SettingGroupList } from "../../SettingGroupList";
import { Autostart } from "./Autostart";
import { CustomWebBrowserExecutable } from "./CustomWebBrowserExecutable";
import { DockSettings } from "./DockSettings";
import { HotKey } from "./HotKey";
import { Language } from "./Language";
import { SearchHistory } from "./SearchHistory";
import { UrlImageGenerator } from "./UrlImageGenerator";
import { UseDefaultBrowser } from "./UseDefaultBrowser";

export const General = () => {
    const { contextBridge } = useContextBridge();

    const { value: useDefaultWebBrowser, updateValue: setUseDefaultWebBrowser } = useSetting({
        defaultValue: true,
        key: "general.browser.useDefaultWebBrowser",
    });

    return (
        <SettingGroupList>
            <SettingGroup title="General">
                <Language />
                <HotKey />
                <Autostart />
                {contextBridge.getOperatingSystem() === "macOS" && <DockSettings />}
            </SettingGroup>
            <SettingGroup title="Search History">
                <SearchHistory />
            </SettingGroup>
            <SettingGroup title="Icons">
                <UrlImageGenerator />
            </SettingGroup>
            <SettingGroup title="Browser">
                <UseDefaultBrowser
                    useDefaultWebBrowser={useDefaultWebBrowser}
                    setUseDefaultBrowser={setUseDefaultWebBrowser}
                />
                <CustomWebBrowserExecutable useDefaultWebBrowser={useDefaultWebBrowser} />
            </SettingGroup>
        </SettingGroupList>
    );
};
