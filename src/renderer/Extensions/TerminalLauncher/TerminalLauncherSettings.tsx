import { useContextBridge, useExtensionSetting } from "@Core/Hooks";
import { Section } from "@Core/Settings/Section";
import { SectionList } from "@Core/Settings/SectionList";
import type { OperatingSystem } from "@common/Core";
import { Dropdown, Field, Option } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const TerminalLauncherSettings = () => {
    const { contextBridge } = useContextBridge();
    const { t } = useTranslation();

    const extensionId = "TerminalLauncher";
    const ns = "extension[TerminalLauncher]";

    const options: Record<OperatingSystem, string[]> = {
        macOS: ["Terminal", "iTerm"],
        Windows: ["Command Prompt", "Powershell", "Powershell Core", "WSL"],
        Linux: [],
    };

    const { value: terminalIds, updateValue: setTerminalIds } = useExtensionSetting<string[]>({
        extensionId,
        key: "terminalIds",
    });

    return (
        <SectionList>
            <Section>
                <Field label={t("terminal", { ns })}>
                    <Dropdown
                        selectedOptions={terminalIds}
                        value={terminalIds.join(", ")}
                        multiselect
                        onOptionSelect={(_, { selectedOptions }) => setTerminalIds(selectedOptions)}
                    >
                        {options[contextBridge.getOperatingSystem()].map((option) => (
                            <Option key={option} value={option} text={option}>
                                <img
                                    src={`file://${contextBridge.getExtensionAssetFilePath(extensionId, option)}`}
                                    width={24}
                                    alt={option}
                                />
                                <span>{option}</span>
                            </Option>
                        ))}
                    </Dropdown>
                </Field>
            </Section>
        </SectionList>
    );
};
