import { useExtensionSetting } from "@Core/Hooks";
import { Button, Field, Input, Tooltip } from "@fluentui/react-components";
import { AddRegular, DismissRegular, FolderRegular } from "@fluentui/react-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const Folders = () => {
    const { t } = useTranslation("extension[ApplicationSearch]");

    const { value: folders, updateValue: setFolders } = useExtensionSetting<string[]>({
        extensionId: "ApplicationSearch",
        key: "windowsFolders",
    });

    const [newFolder, setNewFolder] = useState<string>("");

    const removeFolder = async (folder: string) => {
        await setFolders(folders.filter((f) => f !== folder));
    };

    const addFolder = async (folder: string) => {
        await setFolders([...folders, folder]);
        setNewFolder("");
    };

    const chooseFolder = async () => {
        const result = await window.ContextBridge.showOpenDialog({ properties: ["openDirectory"] });

        if (!result.canceled && result.filePaths.length) {
            setNewFolder(result.filePaths[0]);
        }
    };

    const newFolderExists = window.ContextBridge.fileExists(newFolder);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {folders.map((folder) => (
                <Input
                    readOnly
                    value={folder}
                    contentAfter={
                        <Tooltip content={t("remove")} relationship="label" withArrow>
                            <Button
                                size="small"
                                appearance="subtle"
                                icon={<DismissRegular />}
                                onClick={() => removeFolder(folder)}
                            />
                        </Tooltip>
                    }
                />
            ))}
            <Field
                validationMessage={
                    newFolder.length === 0 ? undefined : newFolderExists ? undefined : t("folderDoesNotExist")
                }
                validationState={newFolder.length === 0 ? undefined : newFolderExists ? "success" : "error"}
            >
                <Input
                    value={newFolder}
                    placeholder={t("addFolder")}
                    onChange={(_, { value }) => setNewFolder(value)}
                    contentAfter={
                        <>
                            <Tooltip content={t("chooseFolder")} relationship="label" withArrow>
                                <Button
                                    appearance="subtle"
                                    size="small"
                                    icon={<FolderRegular />}
                                    onClick={() => chooseFolder()}
                                />
                            </Tooltip>
                            <Tooltip content={t("add")} relationship="label" withArrow>
                                <Button
                                    appearance="subtle"
                                    size="small"
                                    icon={<AddRegular />}
                                    disabled={newFolder.length === 0 || !newFolderExists}
                                    onClick={() => addFolder(newFolder)}
                                />
                            </Tooltip>
                        </>
                    }
                />
            </Field>
        </div>
    );
};
