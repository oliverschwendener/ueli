import type { Workflow, WorkflowAction } from "@common/Extensions/Workflow";
import { Button, Field, Input } from "@fluentui/react-components";
import { useState } from "react";
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
    const [workflow, setWorkflow] = useState<Workflow>(initialWorkflow ?? generateTemporaryWorkflow());

    const setWorkflowName = (name: string) => setWorkflow({ ...workflow, name });

    const addAction = (action: WorkflowAction<unknown>) =>
        setWorkflow({ ...workflow, actions: [...workflow.actions, action] });

    const removeAction = (actionId: string) =>
        setWorkflow({ ...workflow, actions: workflow.actions.filter((action) => action.id !== actionId) });

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

            <ActionCardList actions={workflow.actions} removeAction={removeAction} />

            <NewAction add={addAction} />

            <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", gap: 5 }}>
                <Button onClick={cancel}>Cancel</Button>
                <Button onClick={() => save(workflow)} appearance="primary">
                    Save
                </Button>
            </div>
        </form>
    );
};
