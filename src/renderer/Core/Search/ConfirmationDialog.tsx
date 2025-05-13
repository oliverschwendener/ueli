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
    confirm: () => void;
};

export const ConfirmationDialog = ({ action, closeDialog, confirm }: ConfirmationDialogProps) => {
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
                        {action?.descriptionTranslation
                            ? t(action?.descriptionTranslation.key, { ns: action?.descriptionTranslation.namespace })
                            : action?.description}
                        "
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeDialog} appearance="secondary">
                            No
                        </Button>
                        <Button
                            onClick={() => {
                                confirm();
                                closeDialog();
                            }}
                            appearance="primary"
                        >
                            Yes
                        </Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};
