import { useSetting } from "@Core/Hooks";
import { Dropdown, Field, Option } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { Section } from "../Section";
import { SectionList } from "../SectionList";

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
        <SectionList>
            <Section>
                <Field label={t("singleClickBehavior", { ns })}>
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
                </Field>
            </Section>
            <Section>
                <Field label={t("doubleClickBehavior", { ns })}>
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
                </Field>
            </Section>
        </SectionList>
    );
};
