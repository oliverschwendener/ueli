import { useContextBridge, useExtensionSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { SettingGroup } from "@Core/Settings/SettingGroup";
import { SettingGroupList } from "@Core/Settings/SettingGroupList";
import { Button, Input, SpinButton, Tooltip } from "@fluentui/react-components";
import { FolderRegular } from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";

export const FileSearchSettings = () => {
    const { t } = useTranslation("extension[FileSearch]");
    const { contextBridge } = useContextBridge();

    const { value: maxSearchResultCount, updateValue: setMaxSearchResultCount } = useExtensionSetting<number>({
        extensionId: "FileSearch",
        key: "maxSearchResultCount",
    });

    const { value: esFilePath, updateValue: setEsFilePath } = useExtensionSetting<string>({
        extensionId: "FileSearch",
        key: "everythingCliFilePath",
    });

    const chooseFile = async () => {
        const result = await contextBridge.showOpenDialog({ properties: ["openFile"] });
        if (!result.canceled && result.filePaths.length > 0) {
            setEsFilePath(result.filePaths[0]);
        }
    };

    return (
        <SettingGroupList>
            <SettingGroup title={t("extensionName")}>
                <Setting
                    label={t("maxSearchResults")}
                    control={
                        <SpinButton
                            value={maxSearchResultCount}
                            min={1}
                            onChange={(_, { value }) => value && setMaxSearchResultCount(value)}
                        />
                    }
                />
                {contextBridge.getOperatingSystem() === "Windows" && (
                    <Setting
                        label={t("esFilePath")}
                        description={contextBridge.fileExists(esFilePath) ? undefined : t("fileDoesNotExist")}
                        control={
                            <div style={{ display: "flex", flexDirection: "column", width: "80%" }}>
                                <Input
                                    value={esFilePath}
                                    onChange={(_, { value }) => setEsFilePath(value)}
                                    contentAfter={
                                        <Tooltip relationship="label" content="Choose file" withArrow>
                                            <Button
                                                size="small"
                                                appearance="subtle"
                                                icon={<FolderRegular fontSize={14} />}
                                                onClick={() => chooseFile()}
                                            />
                                        </Tooltip>
                                    }
                                />
                            </div>
                        }
                    />
                )}
            </SettingGroup>
        </SettingGroupList>
    );
};
