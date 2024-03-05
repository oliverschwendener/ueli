import { Section } from "../../Section";
import { SectionList } from "../../SectionList";
import { Logs } from "./Logs";
import { ResetSettings } from "./ResetSettings";

export const Debug = () => {
    return (
        <SectionList>
            <Section>
                <ResetSettings />
            </Section>
            <Section>
                <Logs />
            </Section>
        </SectionList>
    );
};
