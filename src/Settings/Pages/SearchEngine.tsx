import { Field, Input, Slider, Switch } from "@fluentui/react-components";
import { useSetting } from "../../Hooks";
import { Section } from "../Section";
import { SectionList } from "../SectionList";

export const SearchEngine = () => {
    const { value: automaticRescanEnabled, updateValue: setAutomaticRescanEnabled } = useSetting(
        "searchEngine.automaticRescan",
        true,
    );
    const { value: rescanIntervalInSeconds, updateValue: setRescanIntervalInSeconds } = useSetting(
        "searchEngine.rescanIntervalInSeconds",
        60,
    );

    const { value: fuzzyness, updateValue: setFuzzyness } = useSetting("searchEngine.fuzzyness", 0.6);

    return (
        <SectionList>
            <Section>
                <label id="searchEngine.automaticRescan">Automatic rescan</label>
                <Switch
                    aria-labelledby="searchEngine.automaticRescan"
                    checked={automaticRescanEnabled}
                    onChange={(_, { checked }) => setAutomaticRescanEnabled(checked)}
                />
            </Section>
            <Section>
                <Field label="Rescan interval in seconds" validationState="none">
                    <Input
                        value={`${rescanIntervalInSeconds}`}
                        onChange={(_, { value }) => setRescanIntervalInSeconds(Number(value))}
                        type="number"
                        disabled={!automaticRescanEnabled}
                    />
                </Field>
            </Section>
            <Section>
                <label id="searchEngine.fuzzyness">Fuzzyness</label>
                <Slider
                    aria-labelledby="searchEngine.fuzzyness"
                    value={fuzzyness}
                    min={0}
                    max={1}
                    step={0.1}
                    onChange={(_, { value }) => setFuzzyness(value)}
                />
            </Section>
        </SectionList>
    );
};
