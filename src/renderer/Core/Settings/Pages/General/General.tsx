import { Section } from "../../Section";
import { SectionList } from "../../SectionList";
import { Autostart } from "./Autostart";
import { HotKey } from "./HotKey";
import { Language } from "./Language";
import { StartHidden } from "./StartHidden";

export const General = () => {
    return (
        <SectionList>
            <Section>
                <Language />
            </Section>
            <Section>
                <HotKey />
            </Section>
            <Section>
                <Autostart />
            </Section>
            <Section>
                <StartHidden />
            </Section>
        </SectionList>
    );
};
