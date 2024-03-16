import { useExtensionSetting } from "@Core/Hooks";
import { Section } from "@Core/Settings/Section";
import { SectionList } from "@Core/Settings/SectionList";
import { Field, Input } from "@fluentui/react-components";

export const LinuxSettings = () => {
    const extensionId = "ApplicationSearch";

    const { value: folders } = useExtensionSetting<string[]>({
        extensionId,
        key: "linuxFolders",
    });

    return (
        <SectionList>
            <Section>
                <Field
                    label="Application Folders (Hardcoded - Cannot be changed)"
                    style={{ display: "flex", flexDirection: "column", gap: 5 }}
                >
                    {folders.map((folder) => (
                        <Input key={`linuxFolder-${folder}`} value={folder} readOnly={true} disabled={true} />
                    ))}
                </Field>
            </Section>
        </SectionList>
    );
};
