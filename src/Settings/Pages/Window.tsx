import { Switch } from "@fluentui/react-components";
import { useSetting } from "../../Hooks";
import { Section } from "../Section";
import { SectionList } from "../SectionList";

export const Window = () => {
    const { value: hideWindowOnBlur, updateValue: setHideWindowOnBlur } = useSetting("window.hideWindowOnBlur", true);

    const { value: hideWindowAfterExecution, updateValue: setHideWindowAfterExecution } = useSetting(
        "window.hideWindowAfterExecution",
        true,
    );

    return (
        <SectionList>
            <Section>
                <label id="hide-window-on-blur">Hide window on blur</label>
                <Switch
                    aria-labelledby="hide-window-on-blur"
                    checked={hideWindowOnBlur}
                    onChange={(_, { checked }) => setHideWindowOnBlur(checked)}
                />
            </Section>

            <Section>
                <label id="hide-window-on-blur">Hide window after execution</label>
                <Switch
                    aria-labelledby="hide-window-after-execution"
                    checked={hideWindowAfterExecution}
                    onChange={(_, { checked }) => setHideWindowAfterExecution(checked)}
                />
            </Section>
        </SectionList>
    );
};
