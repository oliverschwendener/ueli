import { Switch } from "@fluentui/react-components";
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

    return (
        <SectionList>
            <Section>
                <label id="hide-window-on-blur">{t("settingsWindow.hideWindowOnBlur")}</label>
                <Switch
                    aria-labelledby="hide-window-on-blur"
                    checked={hideWindowOnBlur}
                    onChange={(_, { checked }) => setHideWindowOnBlur(checked)}
                />
            </Section>

            <Section>
                <label id="hide-window-on-blur">{t("settingsWindow.hideWindowAfterExecution")}</label>
                <Switch
                    aria-labelledby="hide-window-after-execution"
                    checked={hideWindowAfterExecution}
                    onChange={(_, { checked }) => setHideWindowAfterExecution(checked)}
                />
            </Section>
        </SectionList>
    );
};
