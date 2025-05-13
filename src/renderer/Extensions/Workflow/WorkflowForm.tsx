import type { Workflow, WorkflowAction } from "@common/Extensions/Workflow";
import { Button, Checkbox, Field, Input } from "@fluentui/react-components";
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
    const { t } = useTranslation("extension[Workflow]");

    const [workflow, setWorkflow] = useState<Workflow>(initialWorkflow ?? generateTemporaryWorkflow());

    const setWorkflowName = (name: string) => setWorkflow({ ...workflow, name });

    const setRequiresConfirmation = (requiresConfirmation: boolean) =>
        setWorkflow({ ...workflow, requiresConfirmation });

    const addAction = (action: WorkflowAction<unknown>) =>
        setWorkflow({ ...workflow, actions: [...workflow.actions, action] });

    const removeAction = (actionId: string) =>
        setWorkflow({ ...workflow, actions: workflow.actions.filter((action) => action.id !== actionId) });

    const nameIsValid = () => workflow.name.trim().length > 0;

    const isValid = () => {
        const rules: (() => boolean)[] = [() => nameIsValid(), () => workflow.actions.length > 0];
        return rules.every((rule) => rule());
    };

    return (
        <form style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Field
                label={t("workflowName")}
                validationState={nameIsValid() ? "success" : "error"}
                validationMessage={nameIsValid() ? undefined : t("workflowNameError")}
            >
                <Input
                    value={workflow.name}
                    onChange={(_, { value }) => setWorkflowName(value)}
                    autoFocus
                    placeholder={t("workflowNamePlaceholder")}
                />
            </Field>

            {workflow.actions.length > 0 && <ActionCardList actions={workflow.actions} removeAction={removeAction} />}

            <NewAction add={addAction} />

            <Checkbox
                label={t("requiresConfirmation")}
                checked={workflow.requiresConfirmation}
                onChange={(_, { checked }) => setRequiresConfirmation(checked === true)}
            />

            <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", gap: 5 }}>
                <Button onClick={cancel}>{t("cancel")}</Button>
                <Button disabled={!isValid()} onClick={() => save(workflow)} appearance="primary">
                    {t("save")}
                </Button>
            </div>
        </form>
    );
};
