import type { WorkflowAction } from "@common/Extensions/Workflow";
import { Body1Strong, Button, Card, CardHeader, Tooltip } from "@fluentui/react-components";
import { DismissRegular } from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";

type ActionCardProps = {
    action: WorkflowAction<unknown>;
    index: number;
    removeAction: (actionId: string) => void;
};

export const ActionCard = ({ action, index, removeAction }: ActionCardProps) => {
    const { t } = useTranslation("extension[Workflow]");

    return (
        <Card appearance="outline" orientation="horizontal">
            <CardHeader
                header={
                    <Body1Strong>
                        {index + 1}. {action.name}
                    </Body1Strong>
                }
                action={
                    <Tooltip relationship="label" content={t("removeAction")} withArrow>
                        <Button
                            size="small"
                            appearance="subtle"
                            onClick={() => removeAction(action.id)}
                            icon={<DismissRegular fontSize={14} />}
                        />
                    </Tooltip>
                }
            />
        </Card>
    );
};
