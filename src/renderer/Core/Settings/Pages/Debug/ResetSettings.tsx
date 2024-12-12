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
    const { t } = useTranslation("settingsDebug");

    return (
        <Field label={t("resetAllSettings")} hint={t("resetAllSettingsHint")}>
            <Dialog
                onOpenChange={(event) => {
                    event.stopPropagation();
                }}
            >
                <DialogTrigger disableButtonEnhancement>
                    <div>
                        <Button>{t("resetAllSettingsButton")}</Button>
                    </div>
                </DialogTrigger>
                <DialogSurface>
                    <DialogBody>
                        <DialogTitle>{t("resetAllSettingsDialogTitle")}</DialogTitle>
                        <DialogContent>{t("resetAllSettingsDialogContent")}</DialogContent>
                        <DialogActions>
                            <DialogTrigger disableButtonEnhancement>
                                <Button appearance="secondary">{t("resetAllSettingsCancel")}</Button>
                            </DialogTrigger>
                            <Button onClick={() => window.ContextBridge.resetAllSettings()} appearance="primary">
                                {t("resetAllSettingsConfirm")}
                            </Button>
                        </DialogActions>
                    </DialogBody>
                </DialogSurface>
            </Dialog>
        </Field>
    );
};
