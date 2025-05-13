import type { FolderSetting } from "@common/Extensions/SimpleFileSearch";
import { tokens } from "@fluentui/react-components";
import { FolderListItem } from "./FolderListItem";

type FolderListProps = {
    folderSettings: FolderSetting[];
    removeFolderSetting: (id: string) => void;
    updateFolderSetting: (folderSetting: FolderSetting) => void;
};

export const FolderList = ({ folderSettings, removeFolderSetting, updateFolderSetting }: FolderListProps) => {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacingVerticalS }}>
            {folderSettings.map((folderSetting) => (
                <FolderListItem
                    key={folderSetting.id}
                    folderSetting={folderSetting}
                    removeFolderSetting={removeFolderSetting}
                    updateFolderSetting={updateFolderSetting}
                />
            ))}
        </div>
    );
};
