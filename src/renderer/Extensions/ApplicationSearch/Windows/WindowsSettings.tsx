import { Section } from "@Core/Settings/Section";
import { SectionList } from "@Core/Settings/SectionList";
import { FileExtensions } from "./FileExtensions";
import { Folders } from "./Folders";

export const WindowsSettings = () => {
    return (
        <SectionList>
            <Section>
                <Folders />
            </Section>
            <Section>
                <FileExtensions />
            </Section>
        </SectionList>
    );
};
