import type { WorkflowAction } from "@common/Extensions/Workflow";
import { ActionCard } from "./ActionCard";

type ActionCardListProps = {
    actions: WorkflowAction<unknown>[];
    removeAction: (actionId: string) => void;
};

export const ActionCardList = ({ actions, removeAction }: ActionCardListProps) => {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {actions.map((action, index) => (
                <ActionCard key={action.id} action={action} index={index} removeAction={removeAction} />
            ))}
        </div>
    );
};
