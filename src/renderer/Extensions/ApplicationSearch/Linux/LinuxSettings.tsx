import { useExtensionSetting } from "@Core/Hooks";
import { SettingGroup } from "@Core/Settings/SettingGroup";
import { SettingGroupList } from "@Core/Settings/SettingGroupList";
import { Button, Input, Tooltip } from "@fluentui/react-components";
import { AddRegular, DismissRegular, FolderRegular } from "@fluentui/react-icons";
import { useState } from "react";

export const LinuxSettings = () => {
    const extensionId = "ApplicationSearch";

    const [newFolder, setNewFolder] = useState<string>("");

    const { value: folders, updateValue: setFolders } = useExtensionSetting<string[]>({
        extensionId,
        key: "linuxFolders",
    });

    const removeFolder = async (indexToRemove: number) => {
        await setFolders(folders.filter((_, index) => index !== indexToRemove));
    };

    const addFolder = async () => {
        if (newFolder.trim().length) {
            await setFolders([...folders, newFolder]);
            setNewFolder("");
        }
    };

    const chooseFolder = async () => {
        const result = await window.ContextBridge.showOpenDialog({ properties: ["openDirectory"] });

        if (!result.canceled && result.filePaths.length) {
            setNewFolder(result.filePaths[0]);
        }
    };

    return (
        <SettingGroupList>
            <SettingGroup title="Application Folders">
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    {folders.map((folder, index) => (
                        <Input
                            key={`linuxFolder-${folder}`}
                            value={folder}
                            readOnly
                            contentAfter={
                                <Tooltip content="Remove" relationship="label" withArrow>
                                    <Button
                                        appearance="subtle"
                                        size="small"
                                        icon={<DismissRegular fontSize={14} onClick={() => removeFolder(index)} />}
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
                                <Tooltip content="Choose folder" relationship="label" withArrow>
                                    <Button
                                        appearance="subtle"
                                        size="small"
                                        icon={<FolderRegular fontSize={14} />}
                                        onClick={chooseFolder}
                                    />
                                </Tooltip>
                                <Tooltip content="Add" relationship="label" withArrow>
                                    <Button
                                        appearance="subtle"
                                        size="small"
                                        icon={<AddRegular fontSize={14} />}
                                        onClick={addFolder}
                                    />
                                </Tooltip>
                            </>
                        }
                    />
                </div>
            </SettingGroup>
        </SettingGroupList>
    );
};
