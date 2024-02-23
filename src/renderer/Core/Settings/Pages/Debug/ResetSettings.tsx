import { useContextBridge } from "@Core/Hooks";
import {
    Button,
    Dialog,
    DialogActions,
    DialogBody,
    DialogContent,
    DialogSurface,
    DialogTitle,
    DialogTrigger,
    Field,
} from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const ResetSettings = () => {
    const { t } = useTranslation();
    const ns = "settingsDebug";
    const { contextBridge } = useContextBridge();

    return (
        <Field label={t("resetAllSettings", { ns })} hint={t("resetAllSettingsHint", { ns })}>
            <Dialog>
                <DialogTrigger disableButtonEnhancement>
                    <div>
                        <Button>{t("resetAllSettingsButton", { ns })}</Button>
                    </div>
                </DialogTrigger>
                <DialogSurface>
                    <DialogBody>
                        <DialogTitle>{t("resetAllSettingsDialogTitle", { ns })}</DialogTitle>
                        <DialogContent>{t("resetAllSettingsDialogContent", { ns })}</DialogContent>
                        <DialogActions>
                            <DialogTrigger disableButtonEnhancement>
                                <Button appearance="secondary">{t("resetAllSettingsCancel", { ns })}</Button>
                            </DialogTrigger>
                            <Button onClick={() => contextBridge.resetAllSettings()} appearance="primary">
                                {t("resetAllSettingsConfirm", { ns })}
                            </Button>
                        </DialogActions>
                    </DialogBody>
                </DialogSurface>
            </Dialog>
        </Field>
    );
};
