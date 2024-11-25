import { useExtensionSetting } from "@Core/Hooks";
import { SettingGroup } from "@Core/Settings/SettingGroup";
import { SettingGroupList } from "@Core/Settings/SettingGroupList";
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
import { AddRegular, EditRegular } from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";
import { DeleteWorkflowButton } from "./DeleteWorkflowButton";
import { EditWorkflow } from "./EditWorkflow";

export const WorkflowSettings = () => {
    const { t } = useTranslation("extension[Workflow]");

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
        <SettingGroupList>
            <SettingGroup title={t("newWorkflow")}>
                <EditWorkflow
                    save={addWorkflow}
                    trigger={
                        <div>
                            <Button icon={<AddRegular />}>{t("addWorkflow")}</Button>
                        </div>
                    }
                />
            </SettingGroup>
            <SettingGroup>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderCell>{t("workflows")}</TableHeaderCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {workflows.map((workflow) => (
                            <TableRow key={workflow.id}>
                                <TableCell>
                                    <TableCellLayout>
                                        <Body1Strong style={{ marginRight: 5 }}>{workflow.name}</Body1Strong>
                                        <Caption1>
                                            - {workflow.actions.length} {t("actions")}
                                        </Caption1>
                                    </TableCellLayout>
                                    <TableCellActions>
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                gap: 5,
                                                marginRight: 10,
                                            }}
                                        >
                                            <EditWorkflow
                                                workflow={workflow}
                                                save={updateWorkflow}
                                                trigger={
                                                    <Tooltip relationship="label" content={t("editWorkflow")} withArrow>
                                                        <Button size="small" icon={<EditRegular fontSize={14} />} />
                                                    </Tooltip>
                                                }
                                            />
                                            <DeleteWorkflowButton workflow={workflow} deleteWorkflow={deleteWorkflow} />
                                        </div>
                                    </TableCellActions>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </SettingGroup>
        </SettingGroupList>
    );
};
