import { useSetting } from "@Core/Hooks";
import { SettingGroup } from "@Core/Settings/SettingGroup";
import { useTranslation } from "react-i18next";

import { SettingGroupList } from "../../SettingGroupList";
import { AlwaysOnTop } from "./AlwaysOnTop";
import { BackgroundMaterial } from "./BackgroundMaterial";
import { CustomStartupSize } from "./CustomStartupSize";
import { HideWindowOn } from "./HideWindowOn";
import { Opacity } from "./Opacity";
import { ScrollBehavior } from "./ScrollBehavior";
import { ShowOnStartup } from "./ShowOnStartup";
import { StartupWindowDimension } from "./StartupWindowDimension";
import { Vibrancy } from "./Vibrancy";
import { WorkspaceVisibility } from "./WorkspaceVisibility";

export const Window = () => {
    const { t } = useTranslation("settingsWindow");
    const operatingSystem = window.ContextBridge.getOperatingSystem();

    const { value: backgroundMaterial, updateValue: setBackgroundMaterial } = useSetting({
        key: "window.backgroundMaterial",
        defaultValue: "Mica",
    });

    const { value: useCustomSize, updateValue: setUseCustomSize } = useSetting({
        key: "window.useCustomSize",
        defaultValue: false,
    });

    return (
        <SettingGroupList>
            <SettingGroup title="Behavior">
                <AlwaysOnTop />
                <ShowOnStartup />
                <HideWindowOn />
                <ScrollBehavior />
                {["macOS", "Linux"].includes(operatingSystem) && <WorkspaceVisibility />}
            </SettingGroup>

            <SettingGroup title="Appearance">
                {operatingSystem === "Windows" && (
                    <BackgroundMaterial
                        backgroundMaterial={backgroundMaterial}
                        setBackgroundMaterial={setBackgroundMaterial}
                    />
                )}
                {operatingSystem === "Windows" && backgroundMaterial === "Acrylic" && <Opacity />}
                {operatingSystem === "macOS" && <Vibrancy />}
            </SettingGroup>

            <SettingGroup title="Size">
                <CustomStartupSize useCustomSize={useCustomSize} setUseCustomSize={setUseCustomSize} />
                <StartupWindowDimension
                    settingKey="window.startupWidth"
                    label={t("width")}
                    defaultValue={600}
                    minimum={300}
                    disabled={!useCustomSize}
                />
                <StartupWindowDimension
                    settingKey="window.startupHeight"
                    label={t("height")}
                    defaultValue={400}
                    minimum={200}
                    disabled={!useCustomSize}
                />
            </SettingGroup>
        </SettingGroupList>
    );
};
