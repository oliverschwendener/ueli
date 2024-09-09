import type { FolderSetting } from "@common/Extensions/SimpleFileSearch";
import { useContextBridge } from "@Core/Hooks";
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogBody,
    DialogContent,
    DialogSurface,
    DialogTitle,
    DialogTrigger,
    Field,
    Input,
    Tooltip,
} from "@fluentui/react-components";
import { AddRegular, FolderRegular } from "@fluentui/react-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";

type TemporaryFolderSetting = FolderSetting & { isValidPath: boolean };

type EditFolderProps = {
    onSave: (folderSetting: FolderSetting) => void;
    initialFolderSetting: TemporaryFolderSetting;
};

export const EditFolder = ({ initialFolderSetting, onSave }: EditFolderProps) => {
    const { t } = useTranslation("extension[SimpleFileSearch]");

    const { contextBridge } = useContextBridge();

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [temporaryFolderSetting, setTemporaryFolderSetting] = useState<TemporaryFolderSetting>(initialFolderSetting);

    const openDialog = () => setIsDialogOpen(true);

    const closeDialog = () => {
        setTemporaryFolderSetting(initialFolderSetting);
        setIsDialogOpen(false);
    };

    const openFileDialog = async () => {
        const result = await contextBridge.showOpenDialog({ properties: ["openDirectory"] });
        if (!result.canceled && result.filePaths.length) {
            setPath(result.filePaths[0]);
        }
    };

    const setPath = (path: string) => {
        setTemporaryFolderSetting({ ...temporaryFolderSetting, path, isValidPath: contextBridge.fileExists(path) });
    };

    const setRecursive = (recursive: boolean) => setTemporaryFolderSetting({ ...temporaryFolderSetting, recursive });

    return (
        <Dialog open={isDialogOpen} onOpenChange={(_, { open }) => (open ? openDialog() : closeDialog())}>
            <DialogTrigger disableButtonEnhancement>
                <Button onClick={openDialog} icon={<AddRegular />}>
                    {t("addFolder")}
                </Button>
            </DialogTrigger>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>{t("addFolder")}</DialogTitle>
                    <DialogContent>
                        <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: 5 }}>
                            <Field
                                label={t("path")}
                                validationMessage={
                                    temporaryFolderSetting.isValidPath ? t("validFolderPath") : t("invalidFolderPath")
                                }
                                validationState={temporaryFolderSetting.isValidPath ? "success" : "error"}
                            >
                                <Input
                                    value={temporaryFolderSetting.path}
                                    onChange={(_, { value }) => setPath(value)}
                                    contentAfter={
                                        <Tooltip relationship="label" content={t("chooseFolder")}>
                                            <Button
                                                size="small"
                                                appearance="subtle"
                                                icon={<FolderRegular />}
                                                onClick={openFileDialog}
                                            />
                                        </Tooltip>
                                    }
                                />
                            </Field>
                            <Checkbox
                                checked={temporaryFolderSetting.recursive}
                                onChange={(_, { checked }) => setRecursive(checked === true)}
                                label={t("recursive")}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <DialogTrigger disableButtonEnhancement>
                            <Button appearance="secondary" onClick={closeDialog}>
                                {t("cancel")}
                            </Button>
                        </DialogTrigger>
                        <Button
                            disabled={!temporaryFolderSetting.isValidPath}
                            onClick={() => {
                                closeDialog();
                                onSave(temporaryFolderSetting);
                            }}
                            appearance="primary"
                        >
                            {t("add")}
                        </Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};
