import { Setting } from "../Setting";
import { SettingGroup } from "../SettingGroup";
import { SettingGroupList } from "../SettingGroupList";

export const About = () => {
    const { electronVersion, nodeJsVersion, v8Version, version } = window.ContextBridge.getAboutUeli();

    return (
        <SettingGroupList>
            <SettingGroup title="Versions">
                <Setting label="Ueli" control={<>{version}</>} />
                <Setting label="Electron" control={<>{electronVersion}</>} />
                <Setting label="Node.js" control={<>{nodeJsVersion}</>} />
                <Setting label="V8" control={<>{v8Version}</>} />
            </SettingGroup>
        </SettingGroupList>
    );
};
