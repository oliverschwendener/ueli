import { useExtensionSetting } from "@Core/Hooks";
import { Section } from "@Core/Settings/Section";
import { SectionList } from "@Core/Settings/SectionList";
import type { Workflow } from "@common/Extensions/Workflow";
import {
    Body1Strong,
    Button,
    Caption1,
    Table,
    TableBody,
    TableCell,
    TableCellActions,
    TableCellLayout,
    TableHeader,
    TableHeaderCell,
    TableRow,
    Tooltip,
} from "@fluentui/react-components";
import { AddRegular, DeleteRegular, EditRegular } from "@fluentui/react-icons";
import { EditWorkflow } from "./EditWorkflow";

export const WorkflowSettings = () => {
    const { value: workflows, updateValue: setWorkflows } = useExtensionSetting<Workflow[]>({
        extensionId: "Workflow",
        key: "workflows",
    });

    const addWorkflow = (workflow: Workflow) => setWorkflows([...workflows, workflow]);

    const deleteWorkflow = (workflowId: string) =>
        setWorkflows(workflows.filter((workflow) => workflow.id !== workflowId));

    const updateWorkflow = (workflow: Workflow) => {
        const index = workflows.findIndex((w) => w.id === workflow.id);
        const newWorkflows = [...workflows];
        newWorkflows[index] = workflow;
        setWorkflows(newWorkflows);
    };

    return (
        <SectionList>
            <Section>
                <EditWorkflow
                    dialogTitle="Add new workflow"
                    save={addWorkflow}
                    trigger={
                        <div>
                            <Button icon={<AddRegular />}>Add new workflow</Button>
                        </div>
                    }
                />
            </Section>
            <Section>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderCell style={{ width: "calc(100% - 40px)" }}>Workflows</TableHeaderCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {workflows.map((workflow) => (
                            <TableRow key={workflow.id}>
                                <TableCell>
                                    <TableCellLayout>
                                        <Body1Strong style={{ marginRight: 5 }}>{workflow.name}</Body1Strong>
                                        <Caption1>- {workflow.actions.length} Actions</Caption1>
                                    </TableCellLayout>
                                    <TableCellActions>
                                        <div style={{ display: "flex", flexDirection: "row", gap: 5, marginRight: 10 }}>
                                            <EditWorkflow
                                                dialogTitle="Edit Workflow"
                                                workflow={workflow}
                                                save={updateWorkflow}
                                                trigger={
                                                    <Tooltip relationship="label" content="Edit Workflow">
                                                        <Button size="small" icon={<EditRegular fontSize={14} />} />
                                                    </Tooltip>
                                                }
                                            />
                                            <Tooltip relationship="label" content="Delete Workflow">
                                                <Button
                                                    size="small"
                                                    icon={
                                                        <DeleteRegular
                                                            onClick={() => deleteWorkflow(workflow.id)}
                                                            fontSize={14}
                                                        />
                                                    }
                                                />
                                            </Tooltip>
                                        </div>
                                    </TableCellActions>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Section>
        </SectionList>
    );
};
