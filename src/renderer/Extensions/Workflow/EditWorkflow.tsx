import type { Workflow } from "@common/Extensions/Workflow";
import {
    Dialog,
    DialogBody,
    DialogContent,
    DialogSurface,
    DialogTitle,
    DialogTrigger,
} from "@fluentui/react-components";
import { useState, type ReactElement } from "react";
import { WorkflowForm } from "./WorkflowForm";

type EditWorkflowProps = {
    dialogTitle: string;
    trigger: ReactElement;
    workflow?: Workflow;
    save: (workflow: Workflow) => void;
};

export const EditWorkflow = ({ trigger, workflow, save, dialogTitle }: EditWorkflowProps) => {
    const [open, setOpen] = useState(false);

    const closeModal = () => setOpen(false);

    return (
        <Dialog open={open} onOpenChange={(_, { open }) => setOpen(open)}>
            <DialogTrigger disableButtonEnhancement>{trigger}</DialogTrigger>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>{dialogTitle}</DialogTitle>
                    <DialogContent>
                        <WorkflowForm
                            cancel={closeModal}
                            save={(w) => {
                                closeModal();
                                save(w);
                            }}
                            initialWorkflow={workflow}
                        />
                    </DialogContent>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};
