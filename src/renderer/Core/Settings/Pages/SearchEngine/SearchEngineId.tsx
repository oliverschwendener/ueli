import { useSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { Dropdown, Option } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const SearchEngineId = () => {
    const { t } = useTranslation("settingsSearchEngine");

    const { value: searchEngineId, updateValue: setSearchEngineId } = useSetting({
        key: "searchEngine.id",
        defaultValue: "fuzzysort",
    });

    return (
        <Setting
            label={t("searchEngine")}
            control={
                <Dropdown
                    selectedOptions={[searchEngineId]}
                    value={searchEngineId}
                    onOptionSelect={(_, { optionValue }) => optionValue && setSearchEngineId(optionValue)}
                >
                    <Option value="Fuse.js">Fuse.js</Option>
                    <Option value="fuzzysort">fuzzysort</Option>
                </Dropdown>
            }
        />
    );
};
