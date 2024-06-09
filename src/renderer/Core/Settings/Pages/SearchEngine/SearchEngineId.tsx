import { useSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { Dropdown, Option } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const SearchEngineId = () => {
    const ns = "settingsSearchEngine";
    const { t } = useTranslation();

    const { value: searchEngineId, updateValue: setSearchEngineId } = useSetting({
        key: "searchEngine.id",
        defaultValue: "Fuse.js",
    });

    return (
        <Setting
            label={t("searchEngine", { ns })}
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
