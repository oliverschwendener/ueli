import { Setting } from "@Core/Settings/Setting";
import {
    Button,
    Dialog,
    DialogActions,
    DialogBody,
    DialogContent,
    DialogSurface,
    DialogTitle,
    DialogTrigger,
} from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const ResetSettings = () => {
    const { t } = useTranslation("settingsDebug");

    return (
        <Setting
            label={t("resetAllSettings")}
            description={t("resetAllSettingsHint")}
            control={
                <Dialog>
                    <DialogTrigger disableButtonEnhancement>
                        <Button>{t("resetAllSettingsButton")}</Button>
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
            }
        />
    );
};
