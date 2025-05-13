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
import { DismissRegular } from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";

type RemoveButtonProps = {
    onConfirm: () => void;
};

export const RemoveDialog = ({ onConfirm }: RemoveButtonProps) => {
    const { t } = useTranslation("extension[SimpleFileSearch]");

    return (
        <Dialog>
            <DialogTrigger disableButtonEnhancement>
                <Tooltip withArrow relationship="label" content={t("remove")}>
                    <Button size="small" appearance="subtle" icon={<DismissRegular />} />
                </Tooltip>
            </DialogTrigger>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>{t("removeDialogTitle")}</DialogTitle>
                    <DialogContent>{t("removeDialogContent")}</DialogContent>
                    <DialogActions>
                        <Button onClick={onConfirm} appearance="primary">
                            {t("removeDialogConfirm")}
                        </Button>
                        <DialogTrigger disableButtonEnhancement>
                            <Button appearance="secondary">{t("removeDialogCancel")}</Button>
                        </DialogTrigger>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};
