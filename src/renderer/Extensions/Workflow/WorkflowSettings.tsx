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
import { useTranslation } from "react-i18next";
import { EditWorkflow } from "./EditWorkflow";

export const WorkflowSettings = () => {
    const ns = "extension[Workflow]";
    const { t } = useTranslation();

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
                    save={addWorkflow}
                    trigger={
                        <div>
                            <Button icon={<AddRegular />}>{t("addWorkflow", { ns })}</Button>
                        </div>
                    }
                />
            </Section>
            <Section>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderCell>{t("workflows", { ns })}</TableHeaderCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {workflows.map((workflow) => (
                            <TableRow key={workflow.id}>
                                <TableCell>
                                    <TableCellLayout>
                                        <Body1Strong style={{ marginRight: 5 }}>{workflow.name}</Body1Strong>
                                        <Caption1>
                                            - {workflow.actions.length} {t("actions", { ns })}
                                        </Caption1>
                                    </TableCellLayout>
                                    <TableCellActions>
                                        <div style={{ display: "flex", flexDirection: "row", gap: 5, marginRight: 10 }}>
                                            <EditWorkflow
                                                workflow={workflow}
                                                save={updateWorkflow}
                                                trigger={
                                                    <Tooltip relationship="label" content={t("editWorkflow", { ns })}>
                                                        <Button size="small" icon={<EditRegular fontSize={14} />} />
                                                    </Tooltip>
                                                }
                                            />
                                            <Tooltip relationship="label" content={t("deleteWorkflow", { ns })}>
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
