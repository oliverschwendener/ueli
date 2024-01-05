import type {
    ExtensionSetting,
    ExtensionSettingList as ExtensionSettingListType,
} from "@common/ExtensionSettingsStructure";
import { useContextBridge } from "../Hooks";
import { ExtensionSettingList } from "./ExtensionSettingList";
import { Section } from "./Section";
import { SectionList } from "./SectionList";
import { isType } from "./isType";

type ExtensionSettingsProps = {
    extensionId: string;
};

export const ExtensionSettings = ({ extensionId }: ExtensionSettingsProps) => {
    const { contextBridge } = useContextBridge();

    const extensionSettingsStructure = contextBridge.getExtensionSettingsStructure(extensionId);

    const getSectionBySetting = (setting: ExtensionSetting) => {
        if (isType<ExtensionSettingListType>(setting)) {
            return <ExtensionSettingList extensionId={extensionId} setting={setting} />;
        }

        return null;
    };

    return (
        <SectionList>
            {extensionSettingsStructure.map((setting) => (
                <Section key={setting.id}>
                    <div style={{ paddingLeft: 40, boxSizing: "border-box" }}>{getSectionBySetting(setting)}</div>
                </Section>
            ))}
        </SectionList>
    );
};
