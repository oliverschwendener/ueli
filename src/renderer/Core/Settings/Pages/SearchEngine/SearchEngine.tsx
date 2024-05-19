import { useSetting } from "@Core/Hooks";
import { Section } from "@Core/Settings/Section";
import { SectionList } from "@Core/Settings/SectionList";
import { AutomaticRescan } from "./AutomaticRescan";
import { ExcludedItems } from "./ExcludedItems";
import { Fuzziness } from "./Fuzziness";
import { MaxResultLength } from "./MaxResultLength";
import { RescanInterval } from "./RescanInterval";
import { SearchEngineId } from "./SearchEngineId";

export const SearchEngine = () => {
    const { value: automaticRescanEnabled, updateValue: setAutomaticRescanEnabled } = useSetting({
        key: "searchEngine.automaticRescan",
        defaultValue: true,
    });

    return (
        <SectionList>
            <Section>
                <SearchEngineId />
            </Section>
            <Section>
                <AutomaticRescan
                    automaticRescanEnabled={automaticRescanEnabled}
                    setAutomaticRescanEnabled={setAutomaticRescanEnabled}
                />
            </Section>
            <Section>
                <RescanInterval automaticRescanEnabled={automaticRescanEnabled} />
            </Section>
            <Section>
                <Fuzziness />
            </Section>
            <Section>
                <MaxResultLength />
            </Section>
            <Section>
                <ExcludedItems />
            </Section>
        </SectionList>
    );
};
