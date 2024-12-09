import { useSetting } from "@Core/Hooks";
import { SettingGroup } from "@Core/Settings/SettingGroup";
import { useTranslation } from "react-i18next";
import { CustomWebBrowserCommandlineArguments } from "./CustomWebBrowserCommandlineArguments";
import { CustomWebBrowserExecutable } from "./CustomWebBrowserExecutable";
import { CustomWebBrowserName } from "./CustomWebBrowserName";
import { UseDefaultBrowser } from "./UseDefaultBrowser";

export const CustomWebBrowser = () => {
    const operatingSystem = window.ContextBridge.getOperatingSystem();

    const { t } = useTranslation("settingsGeneral");

    const { value: useDefaultWebBrowser, updateValue: setUseDefaultWebBrowser } = useSetting({
        defaultValue: true,
        key: "general.browser.useDefaultWebBrowser",
    });

    return (
        <SettingGroup title={t("webBrowser")}>
            <UseDefaultBrowser
                useDefaultWebBrowser={useDefaultWebBrowser}
                setUseDefaultBrowser={setUseDefaultWebBrowser}
            />
            {operatingSystem === "Windows" && (
                <CustomWebBrowserExecutable useDefaultWebBrowser={useDefaultWebBrowser} />
            )}
            {operatingSystem === "Windows" && (
                <CustomWebBrowserCommandlineArguments useDefaultWebBrowser={useDefaultWebBrowser} />
            )}
            {operatingSystem === "macOS" && <CustomWebBrowserName useDefaultWebBrowser={useDefaultWebBrowser} />}
        </SettingGroup>
    );
};
