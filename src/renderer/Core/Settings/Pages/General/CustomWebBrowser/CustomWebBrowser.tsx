import { useSetting } from "@Core/Hooks";
import { SettingGroup } from "@Core/Settings/SettingGroup";
import { UseDefaultBrowser } from "../UseDefaultBrowser";
import { CustomWebBrowserExecutable } from "./CustomWebBrowserExecutable";
import { CustomWebBrowserName } from "./CustomWebBrowserName";

export const CustomWebBrowser = () => {
    const operatingSystem = window.ContextBridge.getOperatingSystem();

    const { value: useDefaultWebBrowser, updateValue: setUseDefaultWebBrowser } = useSetting({
        defaultValue: true,
        key: "general.browser.useDefaultWebBrowser",
    });

    return (
        <SettingGroup title="Browser">
            <UseDefaultBrowser
                useDefaultWebBrowser={useDefaultWebBrowser}
                setUseDefaultBrowser={setUseDefaultWebBrowser}
            />
            {operatingSystem === "Windows" && (
                <CustomWebBrowserExecutable useDefaultWebBrowser={useDefaultWebBrowser} />
            )}
            {operatingSystem === "macOS" && <CustomWebBrowserName useDefaultWebBrowser={useDefaultWebBrowser} />}
        </SettingGroup>
    );
};
