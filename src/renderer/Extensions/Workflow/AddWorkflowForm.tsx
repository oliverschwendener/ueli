import { useContextBridge } from "@Core/Hooks";
import { Workflow, WorkflowAction } from "@common/Extensions/Workflow";
import {
    Button,
    Dropdown,
    Field,
    Input,
    Option,
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableHeaderCell,
    TableRow,
} from "@fluentui/react-components";
import { AddRegular, DismissRegular, FolderRegular } from "@fluentui/react-icons";
import { useState } from "react";

type AddWorkflowFormProps = {
    add: (workflow: Workflow) => void;
    cancel: () => void;
};

export const AddWorkflowForm = ({ add, cancel }: AddWorkflowFormProps) => {
    const [workflow, setWorkflow] = useState<Workflow>({
        actions: [],
        name: "",
        id: `workflow-${crypto.randomUUID()}`,
    });

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
                <Table title="Shit">
                    <TableHeader>
                        <TableRow>
                            <TableHeaderCell>Name</TableHeaderCell>
                            <TableHeaderCell>Type</TableHeaderCell>
                            <TableHeaderCell>Args</TableHeaderCell>
                            <TableHeaderCell style={{ width: 40 }}>Action</TableHeaderCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {workflow.actions.map((action) => {
                            return (
                                <TableRow key={`${action.name}-${action.handlerId}`}>
                                    <TableCell>{action.name}</TableCell>
                                    <TableCell>{types[action.handlerId]}</TableCell>
                                    <TableCell>{getActionArgs(action)}</TableCell>
                                    <TableCell>
                                        <Button
                                            size="small"
                                            icon={<DismissRegular fontSize={14} />}
                                            appearance="subtle"
                                            onClick={() => removeAction(action.id)}
                                        ></Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        <TableRow>
                            <TableCell>
                                <Input
                                    value={newAction.name}
                                    onChange={(_, { value }) => setNewActionName(value)}
                                    appearance="underline"
                                    placeholder="Add a name for this step"
                                />
                            </TableCell>
                            <TableCell>
                                <Dropdown
                                    value={types[newAction.handlerId]}
                                    selectedOptions={[newAction.handlerId]}
                                    onOptionSelect={(_, { optionValue }) =>
                                        optionValue && setNewActionHandlerId(optionValue)
                                    }
                                >
                                    {handlerIds.map((handlerId) => (
                                        <Option key={handlerId} value={handlerId}>
                                            {types[handlerId]}
                                        </Option>
                                    ))}
                                </Dropdown>
                            </TableCell>
                            <TableCell>
                                <Input
                                    value={getActionArgs(newAction)}
                                    onChange={(_, { value }) => setNewActionArgs(value)}
                                    size="small"
                                    appearance="underline"
                                    contentAfter={getAdditions()}
                                />
                            </TableCell>
                            <TableCell>
                                <Button
                                    size="small"
                                    icon={<AddRegular fontSize={14} />}
                                    appearance="subtle"
                                    onClick={() => addAction(newAction)}
                                ></Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Field>
            <Field>
                <div style={{ display: "flex", flexDirection: "row", gap: 5 }}>
                    <Button onClick={cancel}>Cancel</Button>
                    <Button onClick={() => add(workflow)} appearance="primary">
                        Add
                    </Button>
                </div>
            </Field>
        </form>
    );
};
