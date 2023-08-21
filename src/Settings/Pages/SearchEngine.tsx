import { Field, Input, Switch } from "@fluentui/react-components";
import { Section } from "../Section";
import { SectionList } from "../SectionList";
import { useSetting } from "./Hooks";

export const SearchEngine = () => {
    const { value: automaticRescanEnabled, updateValue: setAutomaticRescanEnabled } = useSetting(
        "searchEngine.automaticRescan",
        true,
    );
    const { value: rescanIntervalInSeconds, updateValue: setRescanIntervalInSeconds } = useSetting(
        "searchEngine.rescanIntervalInSeconds",
        60,
    );

    return (
        <SectionList>
            <Section>
                <label id="test-id">Automatic rescan</label>
                <Switch
                    aria-labelledby="test-id"
                    checked={automaticRescanEnabled}
                    onChange={(_, { checked }) => setAutomaticRescanEnabled(checked)}
                />
            </Section>
            <Section>
                <Field
                    label="Rescan interval in seconds"
                    validationState="none"
                    validationMessage="This is a validation message."
                >
                    <Input
                        value={`${rescanIntervalInSeconds}`}
                        onChange={(_, { value }) => setRescanIntervalInSeconds(Number(value))}
                        type="number"
                        disabled={!automaticRescanEnabled}
                    />
                </Field>
            </Section>
        </SectionList>
    );
};
