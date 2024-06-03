import { useContextBridge } from "@Core/Hooks";
import type { Workflow, WorkflowAction } from "@common/Extensions/Workflow";
import {
    Accordion,
    AccordionHeader,
    AccordionItem,
    AccordionPanel,
    Body1Strong,
    Button,
    Caption1Strong,
    Dropdown,
    Field,
    Input,
    Option,
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@fluentui/react-components";
import { AddRegular, DismissRegular, FolderRegular } from "@fluentui/react-icons";
import { useState } from "react";

type AddWorkflowFormProps = {
    initialWorkflow?: Workflow;
    save: (workflow: Workflow) => void;
    cancel: () => void;
};

export const WorkflowForm = ({ save, cancel, initialWorkflow }: AddWorkflowFormProps) => {
    const generateTemporaryWorkflow = (): Workflow => ({
        actions: [],
        name: "",
        id: `workflow-${crypto.randomUUID()}`,
    });

    const [workflow, setWorkflow] = useState<Workflow>(initialWorkflow ?? generateTemporaryWorkflow());

    const { contextBridge } = useContextBridge();

    const setWorkflowName = (name: string) => setWorkflow({ ...workflow, name });

    const generateNewAction = (): WorkflowAction<unknown> => {
        return {
            id: `workflow-action-${crypto.randomUUID()}`,
            args: { filePath: "" },
            name: "",
            handlerId: "OpenFile",
        };
    };

    const [newAction, setNewAction] = useState<WorkflowAction<unknown>>(generateNewAction());

    const setNewActionHandlerId = (handlerId: string) => setNewAction({ ...newAction, handlerId });

    const setNewActionName = (name: string) => setNewAction({ ...newAction, name });

    // TODO: fing more elegant solution
    const getActionArgs = (action: WorkflowAction<unknown>) => {
        if (action.handlerId === "OpenFile") {
            return (action.args as { filePath: string }).filePath;
        } else if (action.handlerId === "OpenUrl") {
            return (action.args as { url: string }).url;
        } else if (action.handlerId === "ExecuteCommand") {
            return (action.args as { command: string }).command;
        }
    };

    // TODO: fing more elegant solution
    const setNewActionArgs = (args: string) => {
        if (newAction.handlerId === "OpenFile") {
            setNewAction({ ...newAction, args: { filePath: args } });
        } else if (newAction.handlerId === "OpenUrl") {
            setNewAction({ ...newAction, args: { url: args } });
        } else if (newAction.handlerId === "ExecuteCommand") {
            setNewAction({ ...newAction, args: { command: args } });
        }
    };

    // C:\Users\Oliver\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Discord Inc\Discord.lnk

    const addAction = (action: WorkflowAction<unknown>) => {
        setWorkflow({ ...workflow, actions: [...workflow.actions, action] });
        setNewAction(generateNewAction());
    };

    const removeAction = (actionId: string) => {
        setWorkflow({ ...workflow, actions: workflow.actions.filter((action) => action.id !== actionId) });
    };

    const handlerIds = ["OpenFile", "OpenUrl", "ExecuteCommand"];

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

    const selectFile = async () => {
        const result = await contextBridge.showOpenDialog({ properties: ["openFile"] });
        if (!result.canceled && result.filePaths.length > 0) {
            setNewActionArgs(result.filePaths[0]);
        }
    };

    // TODO: find better name
    const getAdditions = () => {
        if (newAction.handlerId === "OpenFile") {
            return (
                <>
                    <Button
                        size="small"
                        icon={<FolderRegular fontSize={14} />}
                        appearance="subtle"
                        onClick={() => selectFile()}
                    ></Button>
                </>
            );
        }
    };

    return (
        <form style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Field label="Workflow name">
                <Input
                    value={workflow.name}
                    onChange={(_, { value }) => setWorkflowName(value)}
                    autoFocus
                    placeholder="Add a name for the workflow"
                />
            </Field>

            <Field label="Actions">
                <Accordion collapsible defaultOpenItems={[newAction.id]}>
                    {workflow.actions.map((action, index) => {
                        return (
                            <AccordionItem value={action.id} key={action.id}>
                                <AccordionHeader>
                                    <Body1Strong>
                                        {index + 1}. {action.name}
                                    </Body1Strong>
                                </AccordionHeader>
                                <AccordionPanel>
                                    <div
                                        style={{
                                            paddingLeft: 20,
                                            boxSizing: "border-box",
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "flex-end",
                                            gap: 10,
                                        }}
                                    >
                                        <Table size="small">
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell style={{ width: 75 }}>
                                                        <Caption1Strong>Type</Caption1Strong>
                                                    </TableCell>
                                                    <TableCell>{types[action.handlerId]}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell style={{ width: 75 }}>
                                                        <Caption1Strong>{argTypes[action.handlerId]}</Caption1Strong>
                                                    </TableCell>
                                                    <TableCell>{getActionArgs(action)}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                        <Button
                                            size="small"
                                            appearance="subtle"
                                            onClick={() => removeAction(action.id)}
                                            icon={<DismissRegular fontSize={14} />}
                                        >
                                            Remove action
                                        </Button>
                                    </div>
                                </AccordionPanel>
                            </AccordionItem>
                        );
                    })}

                    <AccordionItem value={newAction.id} key={newAction.id}>
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
                                    paddingLeft: 20,
                                    boxSizing: "border-box",
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
                                        contentAfter={getAdditions()}
                                        size="small"
                                    />
                                </Field>
                                <div>
                                    <Button
                                        size="small"
                                        icon={<AddRegular fontSize={14} />}
                                        onClick={() => addAction(newAction)}
                                    >
                                        Add action
                                    </Button>
                                </div>
                            </div>
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>
            </Field>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", gap: 5 }}>
                <Button onClick={cancel}>Cancel</Button>
                <Button onClick={() => save(workflow)} appearance="primary">
                    Save
                </Button>
            </div>
        </form>
    );
};
