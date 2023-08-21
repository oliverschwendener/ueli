import { Section } from "../Section";
import { SectionList } from "../SectionList";

export const About = () => {
    return (
        <SectionList>
            <Section>
                <label id="about.ueliVersion">Ueli: 9.0.0-beta.2</label>
            </Section>
            <Section>
                <label id="about.electronVersion">Electron: 24.0.0</label>
            </Section>
        </SectionList>
    );
};
