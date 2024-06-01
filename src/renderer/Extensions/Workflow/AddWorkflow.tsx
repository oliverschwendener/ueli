import { Workflow } from "@common/Extensions/Workflow";
import {
    Button,
    Dialog,
    DialogBody,
    DialogContent,
    DialogSurface,
    DialogTitle,
    DialogTrigger,
} from "@fluentui/react-components";
import { useState } from "react";
import { AddWorkflowForm } from "./AddWorkflowForm";

type AddWorkflowProps = {
    add: (workflow: Workflow) => void;
};

export const AddWorkflow = ({ add }: AddWorkflowProps) => {
    const [open, setOpen] = useState(false);

    const closeModal = () => setOpen(false);

    return (
        <>
            <Dialog open={open} onOpenChange={(event, { open }) => setOpen(open)}>
                <div>
                    <DialogTrigger disableButtonEnhancement>
                        <Button>Add workflow</Button>
                    </DialogTrigger>
                </div>
                <DialogSurface>
                    <DialogBody>
                        <DialogTitle>Add new workflow</DialogTitle>
                        <DialogContent>
                            <AddWorkflowForm
                                add={(workflow) => {
                                    closeModal();
                                    add(workflow);
                                }}
                                cancel={() => closeModal()}
                            />
                        </DialogContent>
                    </DialogBody>
                </DialogSurface>
            </Dialog>
        </>
    );
};
