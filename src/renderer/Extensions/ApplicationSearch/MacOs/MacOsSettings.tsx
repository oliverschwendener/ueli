import { useExtensionSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { SettingGroup } from "@Core/Settings/SettingGroup";
import { SettingGroupList } from "@Core/Settings/SettingGroupList";
import { Button, Dropdown, Input, Option, Tooltip } from "@fluentui/react-components";
import { AddRegular, DismissRegular, FolderRegular } from "@fluentui/react-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const MacOsSettings = () => {
    const extensionId = "ApplicationSearch";

    const [newFolder, setNewFolder] = useState<string>("");

    const { t } = useTranslation(`extension[${extensionId}]`);

    const { value: folders, updateValue: setFolders } = useExtensionSetting<string[]>({
        extensionId,
        key: "macOsFolders",
    });

    const { value: mdfindFilterOption, updateValue: updateMdfindFilterOption } = useExtensionSetting<string>({
        extensionId,
        key: "mdfindFilterOption",
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
                            key={`macOsFolder-${folder}`}
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
            <SettingGroup title={t("advanced")}>
                <Setting
                    label="mdfind filter"
                    control={
                        <Dropdown
                            style={{ width: "100%" }}
                            selectedOptions={[mdfindFilterOption]}
                            value={mdfindFilterOption}
                            onOptionSelect={(_, { optionValue }) => {
                                if (optionValue) {
                                    updateMdfindFilterOption(optionValue);
                                }
                            }}
                        >
                            <Option value="kind:application">kind:application</Option>
                            <Option value="kMDItemKind=='Application'">kMDItemKind=='Application'</Option>
                            <Option value="kMDItemContentType=='com.apple.application-bundle'">
                                kMDItemContentType=='com.apple.application-bundle'
                            </Option>
                        </Dropdown>
                    }
                />
            </SettingGroup>
        </SettingGroupList>
    );
};
