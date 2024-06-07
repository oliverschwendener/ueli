import type { Workflow, WorkflowAction } from "@common/Extensions/Workflow";
import { Button, Field, Input } from "@fluentui/react-components";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActionCardList } from "./ActionCardList";
import { NewAction } from "./NewAction";

type AddWorkflowFormProps = {
    initialWorkflow?: Workflow;
    save: (workflow: Workflow) => void;
    cancel: () => void;
};

const generateTemporaryWorkflow = (): Workflow => ({
    actions: [],
    name: "",
    id: `workflow-${crypto.randomUUID()}`,
});

export const WorkflowForm = ({ save, cancel, initialWorkflow }: AddWorkflowFormProps) => {
    const ns = "extension[Workflow]";
    const { t } = useTranslation();

    const [workflow, setWorkflow] = useState<Workflow>(initialWorkflow ?? generateTemporaryWorkflow());

    const setWorkflowName = (name: string) => setWorkflow({ ...workflow, name });

    const addAction = (action: WorkflowAction<unknown>) =>
        setWorkflow({ ...workflow, actions: [...workflow.actions, action] });

    const removeAction = (actionId: string) =>
        setWorkflow({ ...workflow, actions: workflow.actions.filter((action) => action.id !== actionId) });

    return (
        <form style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Field label={t("workflowName", { ns })}>
                <Input
                    value={workflow.name}
                    onChange={(_, { value }) => setWorkflowName(value)}
                    autoFocus
                    placeholder={t("workflowNamePlaceholder", { ns })}
                />
            </Field>

            {workflow.actions.length > 0 && <ActionCardList actions={workflow.actions} removeAction={removeAction} />}

            <NewAction add={addAction} />

            <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", gap: 5 }}>
                <Button onClick={cancel}>{t("cancel", { ns })}</Button>
                <Button onClick={() => save(workflow)} appearance="primary">
                    {t("save", { ns })}
                </Button>
            </div>
        </form>
    );
};
