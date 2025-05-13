import type { FolderSetting, Settings } from "@common/Extensions/SimpleFileSearch";
import { useExtensionSetting } from "@Core/Hooks";
import { SettingGroup } from "@Core/Settings/SettingGroup";
import { SettingGroupList } from "@Core/Settings/SettingGroupList";
import { Button, tokens } from "@fluentui/react-components";
import { AddRegular } from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";
import { EditDialog } from "./EditDialog";
import { FolderList } from "./FolderList";

export const SimpleFileSearchSettings = () => {
    const extensionId = "SimpleFileSearch";

    const { t } = useTranslation("extension[SimpleFileSearch]");

    const { value: folderSettings, updateValue: setFolderSettings } = useExtensionSetting<Settings["folders"]>({
        extensionId,
        key: "folders",
    });

    const addFolderSetting = (folderSetting: FolderSetting) => setFolderSettings([...folderSettings, folderSetting]);

    const removeFolderSetting = (id: string) =>
        setFolderSettings(folderSettings.filter((folderSetting) => folderSetting.id !== id));

    const updateFolderSetting = (updatedFolderSetting: FolderSetting) => {
        setFolderSettings(
            folderSettings.map((folderSetting) =>
                folderSetting.id === updatedFolderSetting.id ? updatedFolderSetting : folderSetting,
            ),
        );
    };

    return (
        <SettingGroupList>
            <SettingGroup>
                <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacingVerticalM }}>
                    <FolderList
                        folderSettings={folderSettings}
                        removeFolderSetting={removeFolderSetting}
                        updateFolderSetting={updateFolderSetting}
                    />
                    <div>
                        <EditDialog
                            title={t("addFolder")}
                            confirm={t("add")}
                            cancel={t("cancel")}
                            trigger={<Button icon={<AddRegular />}>{t("addFolder")}</Button>}
                            onSave={addFolderSetting}
                        />
                    </div>
                </div>
            </SettingGroup>
        </SettingGroupList>
    );
};
