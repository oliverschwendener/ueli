import { Switch } from "@fluentui/react-components";
import { useSetting } from "../../Hooks";
import { Section } from "../Section";
import { SectionList } from "../SectionList";

export const Window = () => {
    const { value: hideWindowOnBlur, updateValue: setHideWindowOnBlur } = useSetting("window.hideWindowOnBlur", true);

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
        </SectionList>
    );
};
