import { useContextBridge, useSetting } from "@Core/Hooks";
import { Section } from "../../Section";
import { SectionList } from "../../SectionList";
import { AlwaysCenter } from "./AlwaysCenter";
import { AlwaysOnTop } from "./AlwaysOnTop";
import { BackgroundMaterial } from "./BackgroundMaterial";
import { HideWindowOn } from "./HideWindowOn";
import { Opacity } from "./Opacity";
import { ShowOnStartup } from "./ShowOnStartup";
import { Vibrancy } from "./Vibrancy";

export const Window = () => {
    const { contextBridge } = useContextBridge();

    const operatingSystem = contextBridge.getOperatingSystem();

    const { value: backgroundMaterial, updateValue: setBackgroundMaterial } = useSetting({
        key: "window.backgroundMaterial",
        defaultValue: "Mica",
    });

    return (
        <SectionList>
            <Section>
                <AlwaysOnTop />
            </Section>
            <Section>
                <ShowOnStartup />
            </Section>
            <Section>
                <HideWindowOn />
            </Section>
            <Section>
                <AlwaysCenter />
            </Section>

            {operatingSystem === "Windows" ? (
                <Section>
                    <BackgroundMaterial
                        backgroundMaterial={backgroundMaterial}
                        setBackgroundMaterial={setBackgroundMaterial}
                    />
                </Section>
            ) : null}

            {operatingSystem === "Windows" && backgroundMaterial === "Acrylic" ? (
                <Section>
                    <Opacity />
                </Section>
            ) : null}

            {operatingSystem === "macOS" ? (
                <Section>
                    <Vibrancy />
                </Section>
            ) : null}
        </SectionList>
    );
};
