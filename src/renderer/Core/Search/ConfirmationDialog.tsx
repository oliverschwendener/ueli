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
import { useTranslation } from "react-i18next";

type ConfirmationDialogProps = {
    action?: SearchResultItemAction;
    closeDialog: () => void;
    confirm: () => void;
};

export const ConfirmationDialog = ({ action, closeDialog, confirm }: ConfirmationDialogProps) => {
    const { t } = useTranslation("confirmationDialog");

    const actionDescription = action?.descriptionTranslation
        ? t(action?.descriptionTranslation.key, { ns: action?.descriptionTranslation.namespace })
        : action?.description;

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
                    <DialogTitle>{t("title")}</DialogTitle>
                    <DialogContent>{t("description", { actionDescription })}</DialogContent>
                    <DialogActions>
                        <Button onClick={closeDialog} appearance="secondary">
                            {t("cancel")}
                        </Button>
                        <Button
                            onClick={() => {
                                confirm();
                                closeDialog();
                            }}
                            appearance="primary"
                        >
                            {t("confirm")}
                        </Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};
