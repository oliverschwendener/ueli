import { useExtensionSetting } from "@Core/Hooks";
import { Section } from "@Core/Settings/Section";
import { SectionList } from "@Core/Settings/SectionList";
import type { Workflow } from "@common/Extensions/Workflow";
import {
    Button,
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
                            <TableHeaderCell>Name</TableHeaderCell>
                            <TableHeaderCell style={{ width: 80 }}>Action</TableHeaderCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {workflows.map((workflow) => (
                            <TableRow key={workflow.id}>
                                <TableCell>{workflow.name}</TableCell>
                                <TableCell>
                                    <div style={{ display: "flex", flexDirection: "row", gap: 5 }}>
                                        <EditWorkflow
                                            dialogTitle="Edit Workflow"
                                            workflow={workflow}
                                            save={updateWorkflow}
                                            trigger={
                                                <Button size="small" icon={<EditRegular fontSize={14} />}></Button>
                                            }
                                        />
                                        <Button
                                            size="small"
                                            icon={
                                                <DeleteRegular
                                                    onClick={() => deleteWorkflow(workflow.id)}
                                                    fontSize={14}
                                                />
                                            }
                                        ></Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Section>
        </SectionList>
    );
};
