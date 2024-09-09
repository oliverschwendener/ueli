import type { Settings } from "@common/Extensions/SimpleFileSearch";
import { useContextBridge, useExtensionSetting } from "@Core/Hooks";
import { SettingGroup } from "@Core/Settings/SettingGroup";
import { SettingGroupList } from "@Core/Settings/SettingGroupList";
import { Badge, Button, Field, Input, Switch, Tooltip } from "@fluentui/react-components";
import { AddRegular, DismissRegular, FolderRegular } from "@fluentui/react-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";

type NewFolderPathSetting = {
    isValid: boolean;
    path: string;
    recursive: boolean;
};

const initialNewFolderPathSetting: NewFolderPathSetting = {
    isValid: false,
    path: "",
    recursive: false,
};

export const SimpleFileSearchSettings = () => {
    const extensionId = "SimpleFileSearch";

    const { contextBridge } = useContextBridge();

    const [newFolderPathSetting, setNewFolderPathSetting] = useState<NewFolderPathSetting>(initialNewFolderPathSetting);

    const { t } = useTranslation("extension[SimpleFileSearch]");

    const { value: folderSettings, updateValue: setFolderSettings } = useExtensionSetting<Settings["folders"]>({
        extensionId,
        key: "folders",
    });

    const removeFolderPathSetting = (folderPath: string) =>
        setFolderSettings(folderSettings.filter(({ folderPath: f }) => f !== folderPath));

    const addNewFolderPathSetting = () => {
        if (newFolderPathSetting.isValid) {
            setFolderSettings([
                ...folderSettings,
                { folderPath: newFolderPathSetting.path, recursive: newFolderPathSetting.recursive },
            ]);

            setNewFolderPathSetting(initialNewFolderPathSetting);
        }
    };

    const chooseFolder = async () => {
        const result = await contextBridge.showOpenDialog({ properties: ["openDirectory"] });

        if (!result.canceled && result.filePaths.length === 1) {
            const path = result.filePaths[0];

            setNewFolderPathSetting({
                ...newFolderPathSetting,
                path,
                isValid: contextBridge.fileExists(path),
            });
        }
    };

    return (
        <SettingGroupList>
            <SettingGroup title={t("folders")}>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    {folderSettings.map(({ folderPath, recursive }) => (
                        <div style={{ width: "100%", display: "flex", flexDirection: "column" }} key={folderPath}>
                            <Input
                                value={folderPath}
                                contentAfter={
                                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                        {recursive ? (
                                            <Badge size="small" color="warning">
                                                {t("recursive")}
                                            </Badge>
                                        ) : null}
                                        <Tooltip relationship="label" content={t("remove")}>
                                            <Button
                                                size="small"
                                                appearance="subtle"
                                                icon={<DismissRegular />}
                                                onClick={() => removeFolderPathSetting(folderPath)}
                                            />
                                        </Tooltip>
                                    </div>
                                }
                            />
                        </div>
                    ))}
                    <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
                        <Field
                            validationState={
                                newFolderPathSetting.isValid || newFolderPathSetting.path.length === 0
                                    ? undefined
                                    : "error"
                            }
                            validationMessage={
                                newFolderPathSetting.isValid || newFolderPathSetting.path.length === 0
                                    ? undefined
                                    : t("newFolderPathInvalid")
                            }
                        >
                            <Input
                                autoFocus
                                placeholder={t("newFolderPathPlaceholder")}
                                value={newFolderPathSetting.path}
                                onChange={(_, { value }) =>
                                    setNewFolderPathSetting({
                                        ...newFolderPathSetting,
                                        path: value,
                                        isValid: contextBridge.fileExists(value),
                                    })
                                }
                                contentAfter={
                                    <>
                                        <Tooltip relationship="label" content={t("chooseFolder")}>
                                            <Button
                                                size="small"
                                                appearance="subtle"
                                                icon={<FolderRegular />}
                                                onClick={chooseFolder}
                                            />
                                        </Tooltip>
                                        <Tooltip relationship="label" content={t("recursive")}>
                                            <Switch
                                                checked={newFolderPathSetting.recursive}
                                                onChange={(_, { checked }) =>
                                                    setNewFolderPathSetting({
                                                        ...newFolderPathSetting,
                                                        recursive: checked,
                                                    })
                                                }
                                            />
                                        </Tooltip>
                                        <Tooltip relationship="label" content={t("add")}>
                                            <Button
                                                size="small"
                                                appearance="subtle"
                                                disabled={!newFolderPathSetting.isValid}
                                                icon={<AddRegular />}
                                                onClick={addNewFolderPathSetting}
                                            />
                                        </Tooltip>
                                    </>
                                }
                            />
                        </Field>
                    </div>
                </div>
            </SettingGroup>
        </SettingGroupList>
    );
};
