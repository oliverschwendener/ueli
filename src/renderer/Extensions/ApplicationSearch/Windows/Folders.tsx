import { useContextBridge, useExtensionSetting } from "@Core/Hooks";
import { Button, Input, Tooltip } from "@fluentui/react-components";
import { AddRegular, DismissRegular, FolderRegular } from "@fluentui/react-icons";
import { useState } from "react";

export const Folders = () => {
    const { contextBridge } = useContextBridge();

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
        const result = await contextBridge.showOpenDialog({ properties: ["openDirectory"] });
        if (!result.canceled && result.filePaths.length) {
            setNewFolder(result.filePaths[0]);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {folders.map((folder) => (
                <Input
                    readOnly
                    value={folder}
                    contentAfter={
                        <Tooltip content="Remove" relationship="label">
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
            <Input
                value={newFolder}
                placeholder="Add another folder"
                onChange={(_, { value }) => setNewFolder(value)}
                contentAfter={
                    <>
                        <Tooltip content="Choose folder" relationship="label">
                            <Button
                                appearance="subtle"
                                size="small"
                                icon={<FolderRegular />}
                                onClick={() => chooseFolder()}
                            />
                        </Tooltip>
                        <Tooltip content="Add" relationship="label">
                            <Button
                                appearance="subtle"
                                size="small"
                                icon={<AddRegular />}
                                onClick={() => addFolder(newFolder)}
                            />
                        </Tooltip>
                    </>
                }
            />
        </div>
    );
};
