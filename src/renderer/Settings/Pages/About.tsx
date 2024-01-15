import { useContextBridge } from "../../Hooks";
import { Section } from "../Section";
import { SectionList } from "../SectionList";

export const About = () => {
    const { contextBridge } = useContextBridge();

    const { electronVersion, nodeJsVersion, v8Version, version } = contextBridge.getAboutUeli();

    return (
        <SectionList>
            <Section>
                <label id="ueliVersion">Ueli: {version}</label>
            </Section>
            <Section>
                <label id="electronVersion">Electron: {electronVersion}</label>
            </Section>
            <Section>
                <label id="electronVersion">V8: {v8Version}</label>
            </Section>
            <Section>
                <label id="electronVersion">NodeJS: {nodeJsVersion}</label>
            </Section>
        </SectionList>
    );
};
