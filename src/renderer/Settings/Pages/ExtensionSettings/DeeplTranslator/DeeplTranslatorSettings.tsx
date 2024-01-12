import { Input } from "@fluentui/react-components";
import { useExtensionSetting } from "../../../../Hooks/useExtensionSetting";
import { Section } from "../../../Section";
import { SectionList } from "../../../SectionList";

export const DeeplTranslatorSettings = () => {
    const { value: apiKey, updateValue: setApiKey } = useExtensionSetting<string>("DeeplTranslator", "apiKey", "");

    return (
        <SectionList>
            <Section>
                <label id="deeplTranslator.apiKey">API Key</label>
                <Input value={apiKey} onChange={(_, { value }) => setApiKey(value)} />
            </Section>
        </SectionList>
    );
};
