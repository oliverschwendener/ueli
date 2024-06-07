import { useContextBridge } from "@Core/Hooks";
import { OperatingSystem } from "@common/Core";
import type { OpenTerminalActionArgs } from "@common/Extensions/Workflow";
import { Dropdown, Field, Input, Option } from "@fluentui/react-components";
import type { NewActionTypeProps } from "./NewActionTypeProps";

export const NewActionOpenTerminal = ({ args, setArgs }: NewActionTypeProps) => {
    console.log({
        m: "render",
        args,
    });

    const { contextBridge } = useContextBridge();

    const { terminalId, command } = args as OpenTerminalActionArgs;

    const setTerminalId = (newTerminalId: string) => setArgs({ terminalId: newTerminalId, command });

    const setCommand = (newCommand: string) => setArgs({ terminalId, command: newCommand });

    const terminalIds: Record<OperatingSystem, string[]> = {
        Linux: [],
        macOS: ["Terminal", "iTerm"],
        Windows: ["Command Prompt", "PowerShell", "Windows Terminal"],
    };

    return (
        <>
            <Field label="Terminal">
                <Dropdown
                    selectedOptions={[terminalId]}
                    value={terminalId}
                    placeholder="Select a terminal"
                    onOptionSelect={(_, { optionValue }) => optionValue && setTerminalId(optionValue)}
                    disabled={!terminalId}
                >
                    {terminalIds[contextBridge.getOperatingSystem()].map((terminalId) => (
                        <Option key={terminalId} value={terminalId}>
                            {terminalId}
                        </Option>
                    ))}
                </Dropdown>
            </Field>
            <Field label="Command">
                <Input value={command} onChange={(_, { value }) => setCommand(value)} placeholder="Enter a command" />
            </Field>
        </>
    );
};
