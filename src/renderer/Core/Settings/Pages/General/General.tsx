import { Section } from "../../Section";
import { SectionList } from "../../SectionList";
import { Autostart } from "./Autostart";
import { HotKey } from "./HotKey";
import { Language } from "./Language";
import { SearchHistory } from "./SearchHistory";
import { UrlImageGenerator } from "./UrlImageGenerator";

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
                <UrlImageGenerator />
            </Section>
            <SearchHistory />
        </SectionList>
    );
};
