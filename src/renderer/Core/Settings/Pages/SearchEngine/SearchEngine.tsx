import { useSetting } from "@Core/Hooks";
import { SettingGroup } from "@Core/Settings/SettingGroup";
import { SettingGroupList } from "@Core/Settings/SettingGroupList";
import { AutomaticRescan } from "./AutomaticRescan";
import { Fuzziness } from "./Fuzziness";
import { ManualRescanKeyboardShortcut } from "./ManualRescanKeyboardShortcut";
import { MaxResultLength } from "./MaxResultLength";
import { RescanInterval } from "./RescanInterval";
import { SearchEngineId } from "./SearchEngineId";

export const SearchEngine = () => {
    const { value: automaticRescanEnabled, updateValue: setAutomaticRescanEnabled } = useSetting({
        key: "searchEngine.automaticRescan",
        defaultValue: true,
    });

    return (
        <SettingGroupList>
            <SettingGroup title="Search Engine">
                <SearchEngineId />
                <AutomaticRescan
                    automaticRescanEnabled={automaticRescanEnabled}
                    setAutomaticRescanEnabled={setAutomaticRescanEnabled}
                />
                <RescanInterval automaticRescanEnabled={automaticRescanEnabled} />
                <ManualRescanKeyboardShortcut />
                <Fuzziness />
                <MaxResultLength />
            </SettingGroup>
        </SettingGroupList>
    );
};
