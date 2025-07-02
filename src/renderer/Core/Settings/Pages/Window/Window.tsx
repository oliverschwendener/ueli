import { useSetting } from "@Core/Hooks";
import { SettingGroup } from "@Core/Settings/SettingGroup";
import { SettingGroupList } from "../../SettingGroupList";
import { AlwaysOnTop } from "./AlwaysOnTop";
import { BackgroundMaterial } from "./BackgroundMaterial";
import { HideWindowOn } from "./HideWindowOn";
import { Opacity } from "./Opacity";
import { RememberSize } from "./RememberSize";
import { ScrollBehavior } from "./ScrollBehavior";
import { ShowOnStartup } from "./ShowOnStartup";
import { Vibrancy } from "./Vibrancy";
import { WindowHeight } from "./WindowHeight";
import { WindowWidth } from "./WindowWidth";
import { WorkspaceVisibility } from "./WorkspaceVisibility";
import { HideInitialList } from "./HideInitialList";

export const Window = () => {
    const operatingSystem = window.ContextBridge.getOperatingSystem();

    const { value: backgroundMaterial, updateValue: setBackgroundMaterial } = useSetting({
        key: "window.backgroundMaterial",
        defaultValue: "Mica",
    });

    const { value: rememberSize } = useSetting({
        key: "window.rememberSize",
        defaultValue: false,
    });

    return (
        <SettingGroupList>
            <SettingGroup title="Behavior">
                <AlwaysOnTop />
                <ShowOnStartup />
                <HideWindowOn />
                <ScrollBehavior />
                <HideInitialList />
                <RememberSize />
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
            {rememberSize && (
                <SettingGroup title="Window Size">
                    <WindowWidth />
                    <WindowHeight />
                </SettingGroup>
            )}
        </SettingGroupList>
    );
};
