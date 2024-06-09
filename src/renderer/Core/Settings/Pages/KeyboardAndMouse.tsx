import { useSetting } from "@Core/Hooks";
import { Dropdown, Option } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { Setting } from "../Setting";
import { SettingGroup } from "../SettingGroup";
import { SettingGroupList } from "../SettingGroupList";

export const KeyboardAndMouse = () => {
    const { t } = useTranslation();
    const ns = "settingsKeyboardAndMouse";

    const { value: singleClickBehavior, updateValue: setSingleClickBehavior } = useSetting({
        key: "keyboardAndMouse.singleClickBehavior",
        defaultValue: "selectSearchResultItem",
    });

    const { value: doubleClickBehavior, updateValue: setDoubleClickBehavior } = useSetting({
        key: "keyboardAndMouse.doubleClickBehavior",
        defaultValue: "invokeSearchResultItem",
    });

    const clickBehaviorOptions: Record<string, string> = {
        selectSearchResultItem: t("selectSearchResultItem", { ns }),
        invokeSearchResultItem: t("invokeSearchResultItem", { ns }),
    };

    return (
        <SettingGroupList>
            <SettingGroup title="Mouse">
                <Setting
                    label={t("singleClickBehavior", { ns })}
                    control={
                        <Dropdown
                            selectedOptions={[singleClickBehavior]}
                            value={clickBehaviorOptions[singleClickBehavior]}
                            onOptionSelect={(_, { optionValue }) => optionValue && setSingleClickBehavior(optionValue)}
                        >
                            {Object.keys(clickBehaviorOptions).map((clickBehaviorOption) => (
                                <Option key={clickBehaviorOption} value={clickBehaviorOption}>
                                    {clickBehaviorOptions[clickBehaviorOption]}
                                </Option>
                            ))}
                        </Dropdown>
                    }
                />
                <Setting
                    label={t("doubleClickBehavior", { ns })}
                    control={
                        <Dropdown
                            selectedOptions={[doubleClickBehavior]}
                            value={clickBehaviorOptions[doubleClickBehavior]}
                            onOptionSelect={(_, { optionValue }) => optionValue && setDoubleClickBehavior(optionValue)}
                        >
                            {Object.keys(clickBehaviorOptions).map((clickBehaviorOption) => (
                                <Option key={clickBehaviorOption} value={clickBehaviorOption}>
                                    {clickBehaviorOptions[clickBehaviorOption]}
                                </Option>
                            ))}
                        </Dropdown>
                    }
                />
            </SettingGroup>
        </SettingGroupList>
    );
};
