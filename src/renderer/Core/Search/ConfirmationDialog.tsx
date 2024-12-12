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

type ConfirmationDialogProps = {
    action?: SearchResultItemAction;
    closeDialog: () => void;
};

export const ConfirmationDialog = ({ action, closeDialog }: ConfirmationDialogProps) => {
    const invokeAction = async () => {
        if (action) {
            closeDialog();
            await window.ContextBridge.invokeAction(action);
        }
    };

    return (
        <Dialog
            open={action !== undefined}
            onOpenChange={(event, { open }) => {
                event.stopPropagation();
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
                        {action?.descriptionTranslation
                            ? t(action?.descriptionTranslation.key, { ns: action?.descriptionTranslation.namespace })
                            : action?.description}
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
