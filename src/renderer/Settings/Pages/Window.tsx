import { Dropdown, Option, Switch } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { useSetting } from "../../Hooks";
import { Section } from "../Section";
import { SectionList } from "../SectionList";

export const Window = () => {
    const { t } = useTranslation();

    const { value: hideWindowOnBlur, updateValue: setHideWindowOnBlur } = useSetting("window.hideWindowOnBlur", true);

    const { value: hideWindowAfterExecution, updateValue: setHideWindowAfterExecution } = useSetting(
        "window.hideWindowAfterExecution",
        true,
    );

    const { value: backgroundMaterial, updateValue: setBackgroundMaterial } = useSetting(
        "window.backgroundMaterial",
        "mica",
    );

    return (
        <SectionList>
            <Section>
                <label id="window.hideWindowOnblur">{t("settingsWindow.hideWindowOnBlur")}</label>
                <Switch
                    aria-labelledby="window.hideWindowOnblur"
                    checked={hideWindowOnBlur}
                    onChange={(_, { checked }) => setHideWindowOnBlur(checked)}
                />
            </Section>

            <Section>
                <label id="window.hideWindowAfterExecution">{t("settingsWindow.hideWindowAfterExecution")}</label>
                <Switch
                    aria-labelledby="window.hideWindowAfterExecution"
                    checked={hideWindowAfterExecution}
                    onChange={(_, { checked }) => setHideWindowAfterExecution(checked)}
                />
            </Section>

            <Section>
                <label id="window.backgroundMaterial">Background material</label>
                <Dropdown
                    aria-labelledby="window.backgroundMaterial"
                    value={backgroundMaterial}
                    onOptionSelect={(_, { optionValue }) => optionValue && setBackgroundMaterial(optionValue)}
                >
                    <Option key="none" value="none">
                        None
                    </Option>
                    <Option key="mica" value="mica">
                        Mica
                    </Option>
                    <Option key="tabbed" value="tabbed">
                        Tabbed
                    </Option>
                    <Option key="acrylic" value="acrylic">
                        Acrylic
                    </Option>
                </Dropdown>
            </Section>
        </SectionList>
    );
};
