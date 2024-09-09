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

type TemporaryFolderSetting = FolderSetting & { isValidPath: boolean };

type EditFolderProps = {
    onSave: (folderSetting: FolderSetting) => void;
    initialFolderSetting: TemporaryFolderSetting;
};

export const EditFolder = ({ initialFolderSetting, onSave }: EditFolderProps) => {
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
                    Add folder
                </Button>
            </DialogTrigger>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>Add folder</DialogTitle>
                    <DialogContent>
                        <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: 5 }}>
                            <Field
                                label="Path"
                                validationMessage={
                                    temporaryFolderSetting.isValidPath
                                        ? "Valid folder path"
                                        : "This folder doesn't seem to exist"
                                }
                                validationState={temporaryFolderSetting.isValidPath ? "success" : "error"}
                            >
                                <Input
                                    value={temporaryFolderSetting.path}
                                    onChange={(_, { value }) => setPath(value)}
                                    contentAfter={
                                        <Tooltip relationship="label" content="Choose">
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
                                label="Recursive"
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <DialogTrigger disableButtonEnhancement>
                            <Button appearance="secondary" onClick={closeDialog}>
                                Cancel
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
                            Add
                        </Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};
