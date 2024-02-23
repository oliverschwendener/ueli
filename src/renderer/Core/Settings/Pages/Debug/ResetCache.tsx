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
    Spinner,
} from "@fluentui/react-components";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const ResetCache = () => {
    const { t } = useTranslation();
    const ns = "settingsDebug";
    const { contextBridge } = useContextBridge();
    const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);
    const [resetIsRunning, setResetIsRunning] = useState<boolean>(false);

    const resetChache = async () => {
        setResetIsRunning(true);

        try {
            await contextBridge.resetChache();
        } catch (error) {
            // do nothing
        } finally {
            setResetIsRunning(false);
            setDialogIsOpen(false);
        }
    };

    return (
        <Field label={t("resetCache", { ns })} hint={t("resetCacheHint", { ns })}>
            <Dialog open={dialogIsOpen}>
                <DialogTrigger disableButtonEnhancement>
                    <div>
                        <Button onClick={() => setDialogIsOpen(true)}>{t("resetCache", { ns })}</Button>
                    </div>
                </DialogTrigger>
                <DialogSurface>
                    <DialogBody>
                        <DialogTitle>
                            {resetIsRunning ? t("resettingCache", { ns }) : t("resetCacheDialogTitle", { ns })}
                        </DialogTitle>
                        <DialogContent>
                            {resetIsRunning ? (
                                <div
                                    style={{
                                        height: 100,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Spinner />
                                </div>
                            ) : (
                                t("resetCacheDialogContent", { ns })
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button
                                disabled={resetIsRunning}
                                appearance="secondary"
                                onClick={() => setDialogIsOpen(false)}
                            >
                                {t("resetCacheCancel", { ns })}
                            </Button>
                            <Button disabled={resetIsRunning} onClick={() => resetChache()} appearance="primary">
                                {t("resetCacheConfirm", { ns })}
                            </Button>
                        </DialogActions>
                    </DialogBody>
                </DialogSurface>
            </Dialog>
        </Field>
    );
};
