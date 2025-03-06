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
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const CustomSettingsFilePath = () => {
    const { t } = useTranslation("settingsGeneral");

    const [dialogIsOpen, setDialogIsOpen] = useState(false);

    const setCustomSettingsFilePath = async () => {
        const { canceled, filePaths } = await window.ContextBridge.showOpenDialog({
            defaultPath: "ueli9.settings.json",
            filters: [{ name: "JSON", extensions: ["json"] }],
        });

        if (!canceled && filePaths.length > 0) {
            await window.ContextBridge.setCustomSettingsFilePath(filePaths[0]);
            setDialogIsOpen(true);
        }
    };

    return (
        <Setting
            label="Set custom settings file path" // TODO: add translation
            control={
                <>
                    <Dialog open={dialogIsOpen} onOpenChange={(_, { open }) => setDialogIsOpen(open)}>
                        <DialogSurface>
                            <DialogBody>
                                <DialogTitle>Restart required</DialogTitle> {/* TODO: add translation */}
                                <DialogContent>
                                    In order to apply the settings from the new file, Ueli needs to restart. Do you want
                                    to proceed? {/* TODO: add translation */}
                                </DialogContent>
                                <DialogActions>
                                    <Button appearance="primary" onClick={() => window.ContextBridge.restartApp()}>
                                        Yes {/* TODO: add translation */}
                                    </Button>
                                    <DialogTrigger disableButtonEnhancement>
                                        <Button appearance="secondary">No {/* TODO: add translation */}</Button>
                                    </DialogTrigger>
                                </DialogActions>
                            </DialogBody>
                        </DialogSurface>
                    </Dialog>
                    <Button onClick={() => setCustomSettingsFilePath()}>Select file</Button>
                </>
            }
        />
    );
};
