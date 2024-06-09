import { useContextBridge } from "@Core/Hooks";
import type { OpenTerminalActionArgs } from "@common/Extensions/Workflow";
import { Dropdown, Field, Input, Option } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import type { NewActionTypeProps } from "./NewActionTypeProps";

export const NewActionOpenTerminal = ({ args, setArgs }: NewActionTypeProps) => {
    const { contextBridge } = useContextBridge();
    const { t } = useTranslation("extension[Workflow]");

    const { terminalId, command } = args as OpenTerminalActionArgs;

    const setTerminalId = (newTerminalId: string) => setArgs({ terminalId: newTerminalId, command });

    const setCommand = (newCommand: string) => setArgs({ terminalId, command: newCommand });

    const defaultTerminalId = contextBridge.getAvailableTerminals()[0]?.id;

    return (
        <>
            <Field label="Terminal">
                <Dropdown
                    selectedOptions={[terminalId || defaultTerminalId]}
                    value={terminalId}
                    placeholder={t("argType.OpenTerminal.terminal.placeholder")}
                    onOptionSelect={(_, { optionValue }) => optionValue && setTerminalId(optionValue)}
                    disabled={!terminalId}
                    size="small"
                >
                    {contextBridge.getAvailableTerminals().map(({ id, name, assetFilePath }) => (
                        <Option key={id} value={id} text={name}>
                            <img src={`file://${assetFilePath}`} alt={name} width={16} />
                            <span>{name}</span>
                        </Option>
                    ))}
                </Dropdown>
            </Field>
            <Field label={t("argType.OpenTerminal.command")}>
                <Input
                    value={command}
                    onChange={(_, { value }) => setCommand(value)}
                    placeholder={t("argType.OpenTerminal.command.placeholder")}
                    size="small"
                />
            </Field>
        </>
    );
};
