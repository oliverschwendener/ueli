import { useSetting } from "@Core/Hooks";
import { Dropdown, Field, Option } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const SearchEngineId = () => {
    const ns = "settingsSearchEngine";
    const { t } = useTranslation();

    const { value: searchEngineId, updateValue: setSearchEngineId } = useSetting({
        key: "searchEngine.id",
        defaultValue: "Fuse.js",
    });

    return (
        <Field label={t("searchEngine", { ns })}>
            <Dropdown
                selectedOptions={[searchEngineId]}
                value={searchEngineId}
                onOptionSelect={(_, { optionValue }) => optionValue && setSearchEngineId(optionValue)}
            >
                <Option value="Fuse.js">Fuse.js</Option>
                <Option value="fuzzysort">fuzzysort</Option>
            </Dropdown>
        </Field>
    );
};
