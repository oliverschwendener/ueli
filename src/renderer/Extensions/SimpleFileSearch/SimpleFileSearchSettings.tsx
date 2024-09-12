import type { FolderSetting, Settings } from "@common/Extensions/SimpleFileSearch";
import { useExtensionSetting } from "@Core/Hooks";
import { SettingGroup } from "@Core/Settings/SettingGroup";
import { SettingGroupList } from "@Core/Settings/SettingGroupList";
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableCellActions,
    TableCellLayout,
    TableHeader,
    TableHeaderCell,
    TableRow,
    Tooltip,
} from "@fluentui/react-components";
import { CheckmarkRegular, DismissRegular } from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";
import { EditFolder } from "./EditFolder";

const createFolderSetting = (): FolderSetting => ({
    id: crypto.randomUUID(),
    path: "",
    recursive: false,
    searchFor: "filesAndFolders",
});

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

    return (
        <SettingGroupList>
            <SettingGroup title={t("folders")}>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderCell>{t("path")}</TableHeaderCell>
                            <TableHeaderCell style={{ width: 100 }}>{t("searchFor")}</TableHeaderCell>
                            <TableHeaderCell style={{ width: 80 }}>{t("recursive")}</TableHeaderCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {folderSettings.map(({ path, recursive, id, searchFor }) => (
                            <TableRow key={path}>
                                <TableCell>{path}</TableCell>
                                <TableCell>{t(`searchFor.${searchFor}`)}</TableCell>
                                <TableCell>
                                    <TableCellLayout
                                        style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}
                                    >
                                        {recursive ? <CheckmarkRegular /> : ""}
                                    </TableCellLayout>
                                    <TableCellActions>
                                        <Tooltip relationship="label" content={t("remove")}>
                                            <Button
                                                size="small"
                                                icon={<DismissRegular />}
                                                onClick={() => removeFolderSetting(id)}
                                            />
                                        </Tooltip>
                                    </TableCellActions>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div>
                    <EditFolder
                        onSave={addFolderSetting}
                        initialFolderSetting={{
                            ...createFolderSetting(),
                            isValidPath: false,
                        }}
                    />
                </div>
            </SettingGroup>
        </SettingGroupList>
    );
};
