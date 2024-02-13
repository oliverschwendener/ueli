import { useExtensionSetting } from "@Core/Hooks";
import { Section } from "@Core/Settings/Section";
import { SectionList } from "@Core/Settings/SectionList";
import { Field, SpinButton } from "@fluentui/react-components";

export const FileSearchSettings = () => {
    const { value: maxSearchResultCount, updateValue: setMaxSearchResultCount } = useExtensionSetting<number>({
        extensionId: "FileSearch",
        key: "maxSearchResultCount",
    });

    return (
        <SectionList>
            <Section>
                <Field label="Max Search Results">
                    <SpinButton
                        value={maxSearchResultCount}
                        min={1}
                        onChange={(_, { value }) => value && setMaxSearchResultCount(value)}
                    />
                </Field>
            </Section>
        </SectionList>
    );
};
