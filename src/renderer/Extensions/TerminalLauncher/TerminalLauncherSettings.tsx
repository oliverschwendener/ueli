import { useContextBridge, useExtensionSetting } from "@Core/Hooks";
import { Section } from "@Core/Settings/Section";
import { SectionList } from "@Core/Settings/SectionList";
import { Dropdown, Field, Input, Option } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const TerminalLauncherSettings = () => {
    const { contextBridge } = useContextBridge();
    const { t } = useTranslation();

    const extensionId = "TerminalLauncher";
    const ns = "extension[TerminalLauncher]";

    const { value: prefix, updateValue: setPrefix } = useExtensionSetting<string>({ extensionId, key: "prefix" });

    const { value: terminalIds, updateValue: setTerminalIds } = useExtensionSetting<string[]>({
        extensionId,
        key: "terminalIds",
    });

    const availableTerminals = contextBridge.getAvailableTerminals();

    return (
        <SectionList>
            <Section>
                <Field label={t("prefix", { ns })} hint={t("prefixDescription", { ns })}>
                    <Input value={prefix} onChange={(_, { value }) => setPrefix(value)} />
                </Field>
            </Section>
            <Section>
                <Field label={t("terminals", { ns })}>
                    <Dropdown
                        selectedOptions={terminalIds}
                        value={terminalIds.join(", ")}
                        placeholder={t("selectTerminals", { ns })}
                        multiselect
                        onOptionSelect={(_, { selectedOptions }) => setTerminalIds(selectedOptions)}
                    >
                        {availableTerminals.map((terminal) => (
                            <Option key={terminal.id} value={terminal.id} text={terminal.name}>
                                <img src={`file://${terminal.assetFilePath}`} width={24} alt={terminal.name} />
                                <span>{terminal.name}</span>
                            </Option>
                        ))}
                    </Dropdown>
                </Field>
            </Section>
        </SectionList>
    );
};
