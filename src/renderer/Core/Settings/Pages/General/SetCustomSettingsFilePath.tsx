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
    Tooltip,
} from "@fluentui/react-components";
import { DismissRegular, DocumentRegular } from "@fluentui/react-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const SetCustomSettingsFilePath = () => {
    const { t } = useTranslation("settingsGeneral");

    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const [validationDialogIsOpen, setValidationDialogIsOpen] = useState(false);

    const [customSettingsFilePath, setCustomSettingsFilePath] = useState<string | undefined>(
        window.ContextBridge.ipcRenderer.sendSync("getCustomSettingsFilePath"),
    );

    const removeCustomSettingsFilePath = () => {
        window.ContextBridge.ipcRenderer.send("removeCustomSettingsFilePath");
        setCustomSettingsFilePath(undefined);
    };

    const selectFile = async (): Promise<string | undefined> => {
        const { canceled, filePaths } = await window.ContextBridge.showOpenDialog({
            defaultPath: "ueli9.settings.json",
            properties: ["openFile"],
            filters: [{ name: "JSON", extensions: ["json"] }],
        });

        return !canceled && filePaths.length ? filePaths[0] : undefined;
    };

    const selectCustomSettingsFilePath = async (filePath: string) => {
        const isValid: boolean = window.ContextBridge.ipcRenderer.sendSync("isValidSettingsFile", { filePath });

        if (!isValid) {
            setValidationDialogIsOpen(true);
            return;
        }

        await window.ContextBridge.ipcRenderer.invoke("setCustomSettingsFilePath", { filePath });
        setCustomSettingsFilePath(filePath);
        setDialogIsOpen(true);
    };

    return (
        <Setting
            label={t("setCustomSettingsFilePath")}
            description={customSettingsFilePath}
            control={
                <div style={{ display: "flex", flexDirection: "row", gap: 4 }}>
                    <Tooltip withArrow relationship="label" content={t("selectFile")}>
                        <Button
                            onClick={async () => {
                                const filePath = await selectFile();

                                if (filePath) {
                                    await selectCustomSettingsFilePath(filePath);
                                }
                            }}
                            icon={<DocumentRegular />}
                        />
                    </Tooltip>
                    <Dialog open={dialogIsOpen} onOpenChange={(_, { open }) => setDialogIsOpen(open)}>
                        <DialogSurface>
                            <DialogBody>
                                <DialogTitle>{t("customSettingsFilePathDialogTitle")}</DialogTitle>
                                <DialogContent>{t("customSettingsFilePathDialogDescription")}</DialogContent>
                                <DialogActions>
                                    <Button onClick={() => window.ContextBridge.restartApp()} appearance="primary">
                                        {t("restartNow")}
                                    </Button>
                                    <DialogTrigger disableButtonEnhancement>
                                        <Button appearance="secondary">{t("no")}</Button>
                                    </DialogTrigger>
                                </DialogActions>
                            </DialogBody>
                        </DialogSurface>
                    </Dialog>
                    <Dialog
                        open={validationDialogIsOpen}
                        onOpenChange={(_, { open }) => setValidationDialogIsOpen(open)}
                    >
                        <DialogSurface>
                            <DialogBody>
                                <DialogTitle>{t("customSettingsFileValidationDialogTitle")}</DialogTitle>
                                <DialogContent>{t("customSettingsFileValidationDialogDescription")}</DialogContent>
                                <DialogActions>
                                    <DialogTrigger disableButtonEnhancement>
                                        <Button appearance="secondary">{t("close")}</Button>
                                    </DialogTrigger>
                                </DialogActions>
                            </DialogBody>
                        </DialogSurface>
                    </Dialog>
                    <Tooltip withArrow content={t("remove")} relationship="label">
                        <Button
                            disabled={!customSettingsFilePath}
                            onClick={() => removeCustomSettingsFilePath()}
                            icon={<DismissRegular />}
                        />
                    </Tooltip>
                </div>
            }
        />
    );
};
