import { useContextBridge, useSetting } from "@Core/Hooks";
import { SettingGroup } from "@Core/Settings/SettingGroup";
import { SettingGroupList } from "../../SettingGroupList";
import { AlwaysCenter } from "./AlwaysCenter";
import { AlwaysOnTop } from "./AlwaysOnTop";
import { BackgroundMaterial } from "./BackgroundMaterial";
import { HideWindowOn } from "./HideWindowOn";
import { Opacity } from "./Opacity";
import { ShowOnStartup } from "./ShowOnStartup";
import { Vibrancy } from "./Vibrancy";

export const Window = () => {
    const { contextBridge } = useContextBridge();

    const operatingSystem = contextBridge.getOperatingSystem();

    const { value: backgroundMaterial, updateValue: setBackgroundMaterial } = useSetting({
        key: "window.backgroundMaterial",
        defaultValue: "Mica",
    });

    return (
        <SettingGroupList>
            <SettingGroup title="Behavior">
                <AlwaysOnTop />
                <ShowOnStartup />
                <AlwaysCenter />
                <HideWindowOn />
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
        </SettingGroupList>
    );
};
