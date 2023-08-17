import { Field, Input, Switch } from "@fluentui/react-components";
import { Section } from "../Section";
import { SectionList } from "../SectionList";

export const SearchEngine = () => {
    return (
        <SectionList>
            <Section>
                <label id="test-id">Automatic rescan</label>
                <Switch
                    aria-labelledby="test-id"
                    checked
                    onChange={(_, { checked }) => {
                        console.log("changed", checked);
                    }}
                />
            </Section>
            <Section>
                <Field
                    label="Rescan interval in seconds"
                    validationState="none"
                    validationMessage="This is a validation message."
                >
                    <Input placeholder="200" />
                </Field>
            </Section>
        </SectionList>
    );
};
