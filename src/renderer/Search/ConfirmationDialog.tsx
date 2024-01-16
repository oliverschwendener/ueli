import type { SearchResultItemAction } from "@common/Core";
import {
    Button,
    Dialog,
    DialogActions,
    DialogBody,
    DialogContent,
    DialogSurface,
    DialogTitle,
} from "@fluentui/react-components";
import { t } from "i18next";
import { useContextBridge } from "../Hooks";

type ConfirmationDialogProps = {
    action?: SearchResultItemAction;
    closeDialog: () => void;
};

export const ConfirmationDialog = ({ action, closeDialog }: ConfirmationDialogProps) => {
    const { contextBridge } = useContextBridge();

    const invokeAction = () => {
        if (action) {
            contextBridge.invokeAction(action);
        }
    };

    return (
        <Dialog
            open={action !== undefined}
            onOpenChange={(_, { open }) => {
                if (open === false) {
                    closeDialog();
                }
            }}
        >
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>Are you sure?</DialogTitle>
                    <DialogContent>
                        You are about to "
                        {action?.descriptionTranslationKey ? t(action?.descriptionTranslationKey) : action?.description}
                        "
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeDialog} appearance="secondary">
                            No
                        </Button>
                        <Button onClick={invokeAction} appearance="primary">
                            Yes
                        </Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};
