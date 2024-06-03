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
    TableHeader,
    TableHeaderCell,
    TableRow,
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
                            <TableHeaderCell style={{ width: 20 }}></TableHeaderCell>
                            <TableHeaderCell style={{ width: 20 }}></TableHeaderCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {workflows.map((workflow) => (
                            <TableRow key={workflow.id}>
                                <TableCell>
                                    <Body1Strong style={{ marginRight: 5 }}>{workflow.name}</Body1Strong>
                                    <Caption1>- {workflow.actions.length} Actions</Caption1>
                                </TableCell>
                                <TableCell style={{ textAlign: "center" }}>
                                    <EditWorkflow
                                        dialogTitle="Edit Workflow"
                                        workflow={workflow}
                                        save={updateWorkflow}
                                        trigger={<Button size="small" icon={<EditRegular fontSize={14} />} />}
                                    />
                                </TableCell>
                                <TableCell style={{ textAlign: "center" }}>
                                    <Button
                                        size="small"
                                        icon={
                                            <DeleteRegular onClick={() => deleteWorkflow(workflow.id)} fontSize={14} />
                                        }
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Section>
        </SectionList>
    );
};
