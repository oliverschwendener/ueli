import type { FolderSetting } from "@common/Extensions/SimpleFileSearch";
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
    Dropdown,
    Field,
    Input,
    Option,
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

const mapTemporaryFolderSettingToFolderSetting = ({
    id,
    path,
    recursive,
    searchFor,
}: TemporaryFolderSetting): FolderSetting => ({
    id,
    path,
    recursive,
    searchFor,
});

export const EditFolder = ({ initialFolderSetting, onSave }: EditFolderProps) => {
    const { t } = useTranslation("extension[SimpleFileSearch]");

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [temporaryFolderSetting, setTemporaryFolderSetting] = useState<TemporaryFolderSetting>(initialFolderSetting);

    const openDialog = () => setIsDialogOpen(true);

    const closeDialog = () => {
        setTemporaryFolderSetting(initialFolderSetting);
        setIsDialogOpen(false);
    };

    const openFileDialog = async () => {
        const result = await window.ContextBridge.showOpenDialog({ properties: ["openDirectory"] });

        if (!result.canceled && result.filePaths.length) {
            setPath(result.filePaths[0]);
        }
    };

    const setPath = (path: string) => {
        setTemporaryFolderSetting({
            ...temporaryFolderSetting,
            path,
            isValidPath: window.ContextBridge.fileExists(path),
        });
    };

    const setRecursive = (recursive: boolean) => setTemporaryFolderSetting({ ...temporaryFolderSetting, recursive });

    const setSearchFor = (searchFor: FolderSetting["searchFor"]) =>
        setTemporaryFolderSetting({ ...temporaryFolderSetting, searchFor });

    return (
        <Dialog
            open={isDialogOpen}
            onOpenChange={(_, { open }) => {
                if (open) {
                    openDialog();
                } else {
                    closeDialog();
                }
            }}
        >
            <DialogTrigger disableButtonEnhancement>
                <Button onClick={openDialog} icon={<AddRegular />}>
                    {t("addFolder")}
                </Button>
            </DialogTrigger>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>{t("addFolder")}</DialogTitle>
                    <DialogContent>
                        <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: 10 }}>
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

                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <label id="searchFor">{t("searchFor")}</label>
                                <Dropdown
                                    id="searchFor"
                                    value={t(`searchFor.${temporaryFolderSetting.searchFor}`)}
                                    selectedOptions={[temporaryFolderSetting.searchFor]}
                                    onOptionSelect={(_, { optionValue }) =>
                                        setSearchFor(optionValue as FolderSetting["searchFor"])
                                    }
                                >
                                    <Option value="files">{t("searchFor.files")}</Option>
                                    <Option value="folders">{t("searchFor.folders")}</Option>
                                    <Option value="filesAndFolders">{t("searchFor.filesAndFolders")}</Option>
                                </Dropdown>
                            </div>

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
                                onSave(mapTemporaryFolderSettingToFolderSetting(temporaryFolderSetting));
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
