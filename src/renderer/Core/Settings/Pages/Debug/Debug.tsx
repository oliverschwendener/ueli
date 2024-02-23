import { Section } from "../../Section";
import { SectionList } from "../../SectionList";
import { Logs } from "./Logs";
import { ResetCache } from "./ResetCache";
import { ResetSettings } from "./ResetSettings";

export const Debug = () => {
    return (
        <SectionList>
            <Section>
                <ResetCache />
            </Section>
            <Section>
                <ResetSettings />
            </Section>
            <Section>
                <Logs />
            </Section>
        </SectionList>
    );
};
