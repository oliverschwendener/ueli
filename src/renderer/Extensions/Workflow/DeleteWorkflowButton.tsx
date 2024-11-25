import type { Workflow } from "@common/Extensions/Workflow";
import {
    Button,
    Dialog,
    DialogActions,
    DialogBody,
    DialogContent,
    DialogSurface,
    DialogTitle,
    DialogTrigger,
    Tooltip,
} from "@fluentui/react-components";
import { DeleteRegular } from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";

type DeleteWorkflowButtonProps = {
    workflow: Workflow;
    deleteWorkflow: (workflowId: string) => void;
};

export const DeleteWorkflowButton = ({ workflow, deleteWorkflow }: DeleteWorkflowButtonProps) => {
    const { t } = useTranslation("extension[Workflow]");

    return (
        <Dialog>
            <DialogTrigger disableButtonEnhancement>
                <Tooltip relationship="label" content={t("deleteWorkflow")} withArrow>
                    <Button size="small" icon={<DeleteRegular fontSize={14} />} />
                </Tooltip>
            </DialogTrigger>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>{t("removeWorkflowConfirmationTitle", { workflowName: workflow.name })}</DialogTitle>
                    <DialogContent>{t("removeWorkflowConfirmationContent")}</DialogContent>
                    <DialogActions>
                        <DialogTrigger disableButtonEnhancement>
                            <Button appearance="secondary">{t("no")}</Button>
                        </DialogTrigger>
                        <Button onClick={() => deleteWorkflow(workflow.id)} appearance="primary">
                            {t("yes")}
                        </Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};
