import { useContextBridge } from "../../Hooks";
import { Section } from "../Section";
import { SectionList } from "../SectionList";

export const About = () => {
    const { contextBridge } = useContextBridge();

    const about = contextBridge.getAboutUeli();

    return (
        <SectionList>
            <Section>
                <label id="about.ueliVersion">Ueli: {about.version}</label>
            </Section>
            <Section>
                <label id="about.electronVersion">Electron: {about.electronVersion}</label>
            </Section>
            <Section>
                <label id="about.electronVersion">V8: {about.v8Version}</label>
            </Section>
            <Section>
                <label id="about.electronVersion">NodeJS: {about.nodeJsVersion}</label>
            </Section>
        </SectionList>
    );
};
