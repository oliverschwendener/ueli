import { useSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { SettingGroup } from "@Core/Settings/SettingGroup";
import { Dropdown, Option } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const SearchResultListSettings = () => {
    const { t } = useTranslation("settingsAppearance");

    const options: Record<string, string> = {
        compact: t("searchResultListLayout.compact"),
        detailed: t("searchResultListLayout.detailed"),
    };

    const { value: layout, updateValue: setLayout } = useSetting({
        key: "appearance.searchResultListLayout",
        defaultValue: "compact",
    });

    return (
        <SettingGroup title="Search Result List">
            <Setting
                label="Layout"
                control={
                    <Dropdown
                        value={options[layout]}
                        selectedOptions={[layout]}
                        onOptionSelect={(_, { optionValue }) => {
                            if (optionValue) {
                                setLayout(optionValue);
                            }
                        }}
                    >
                        {Object.keys(options).map((key) => (
                            <Option key={key} value={key}>
                                {options[key]}
                            </Option>
                        ))}
                    </Dropdown>
                }
            />
        </SettingGroup>
    );
};
