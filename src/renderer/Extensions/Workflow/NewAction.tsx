import { useContextBridge } from "@Core/Hooks";
import type { WorkflowAction } from "@common/Extensions/Workflow";
import {
    Accordion,
    AccordionHeader,
    AccordionItem,
    AccordionPanel,
    Body1Strong,
    Button,
    Dropdown,
    Field,
    Input,
    Option,
} from "@fluentui/react-components";
import { AddRegular, FolderRegular } from "@fluentui/react-icons";
import { useState } from "react";

const generateNewAction = (): WorkflowAction<unknown> => {
    return {
        id: `workflow-action-${crypto.randomUUID()}`,
        args: { filePath: "", url: "", command: "" },
        name: "",
        handlerId: "OpenFile",
    };
};

type NewActionProps = {
    add: (action: WorkflowAction<unknown>) => void;
};

export const NewAction = ({ add }: NewActionProps) => {
    const { contextBridge } = useContextBridge();

    const [newAction, setNewAction] = useState<WorkflowAction<unknown>>(generateNewAction());

    const setNewActionHandlerId = (handlerId: string) => setNewAction({ ...newAction, handlerId });

    const setNewActionName = (name: string) => setNewAction({ ...newAction, name });

    const setNewActionArgs = (args: string) => {
        const argsCreators: Record<string, () => unknown> = {
            OpenFile: () => ({ filePath: args }),
            OpenUrl: () => ({ url: args }),
            ExecuteCommand: () => ({ command: args }),
        };

        setNewAction({ ...newAction, args: argsCreators[newAction.handlerId]() });
    };

    const selectFile = async () => {
        const result = await contextBridge.showOpenDialog({ properties: ["openFile"] });
        if (!result.canceled && result.filePaths.length > 0) {
            setNewActionArgs(result.filePaths[0]);
        }
    };

    const argsFieldContentAfter = () => {
        if (newAction.handlerId === "OpenFile") {
            return (
                <Button
                    size="small"
                    icon={<FolderRegular fontSize={14} />}
                    appearance="subtle"
                    onClick={() => selectFile()}
                ></Button>
            );
        }
    };

    const handlerIds = ["OpenFile", "OpenUrl", "ExecuteCommand"];

    const getActionArgs = (action: WorkflowAction<unknown>) => {
        const extractors: Record<string, () => string> = {
            OpenFile: () => (action.args as { filePath: string }).filePath,
            OpenUrl: () => (action.args as { url: string }).url,
            ExecuteCommand: () => (action.args as { command: string }).command,
        };

        return extractors[action.handlerId]();
    };

    const types: Record<string, string> = {
        OpenFile: "Open File",
        OpenUrl: "Open URL",
        ExecuteCommand: "Execute command",
    };

    const argTypes: Record<string, string> = {
        OpenFile: "File path",
        OpenUrl: "URL",
        ExecuteCommand: "Command",
    };

    const argTypesPlaceholder: Record<string, string> = {
        OpenFile: "Enter a File path",
        OpenUrl: "Enter a URL",
        ExecuteCommand: "Enter a Command",
    };

    return (
        <Accordion collapsible>
            <AccordionItem value="newAction">
                <AccordionHeader>
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 5 }}>
                        <Body1Strong>Add new action</Body1Strong>
                    </div>
                </AccordionHeader>
                <AccordionPanel>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 10,
                        }}
                    >
                        <Field label="Action name">
                            <Input
                                value={newAction.name}
                                onChange={(_, { value }) => setNewActionName(value)}
                                placeholder="Add a name for the action"
                                size="small"
                            />
                        </Field>
                        <Field label="Type">
                            <Dropdown
                                value={types[newAction.handlerId]}
                                selectedOptions={[newAction.handlerId]}
                                onOptionSelect={(_, { optionValue }) =>
                                    optionValue && setNewActionHandlerId(optionValue)
                                }
                                size="small"
                            >
                                {handlerIds.map((handlerId) => (
                                    <Option key={handlerId} value={handlerId}>
                                        {types[handlerId]}
                                    </Option>
                                ))}
                            </Dropdown>
                        </Field>
                        <Field label={argTypes[newAction.handlerId]}>
                            <Input
                                value={getActionArgs(newAction)}
                                onChange={(_, { value }) => setNewActionArgs(value)}
                                contentAfter={argsFieldContentAfter()}
                                placeholder={argTypesPlaceholder[newAction.handlerId]}
                                size="small"
                            />
                        </Field>
                        <div>
                            <Button
                                size="small"
                                icon={<AddRegular fontSize={14} />}
                                onClick={() => {
                                    add(newAction);
                                    setNewAction(generateNewAction());
                                }}
                            >
                                Add action
                            </Button>
                        </div>
                    </div>
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    );
};
