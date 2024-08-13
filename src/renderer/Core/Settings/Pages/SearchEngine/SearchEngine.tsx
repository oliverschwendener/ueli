import { useSetting } from "@Core/Hooks";
import { SettingGroup } from "@Core/Settings/SettingGroup";
import { SettingGroupList } from "@Core/Settings/SettingGroupList";
import { useTranslation } from "react-i18next";
import { AutomaticRescan } from "./AutomaticRescan";
import { ExcludedItems } from "./ExcludedItems";
import { Fuzziness } from "./Fuzziness";
import { MaxResultLength } from "./MaxResultLength";
import { MaxResultLengthEmptySearchTerm } from "./MaxResultLengthEmptySearchTerm";
import { RescanInterval } from "./RescanInterval";
import { SearchEngineId } from "./SearchEngineId";

export const SearchEngine = () => {
    const { t } = useTranslation("settingsSearchEngine");

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
                <Fuzziness />
                <MaxResultLength />
                <MaxResultLengthEmptySearchTerm />
            </SettingGroup>
            <SettingGroup title={t("excludedItems")}>
                <ExcludedItems />
            </SettingGroup>
        </SettingGroupList>
    );
};
