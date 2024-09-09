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
import { DismissRegular, PenRegular } from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";
import { EditFolder } from "./EditFolder";

export const SimpleFileSearchSettings = () => {
    const extensionId = "SimpleFileSearch";

    const { t } = useTranslation("extension[SimpleFileSearch]");

    const { value: folderSettings, updateValue: setFolderSettings } = useExtensionSetting<Settings["folders"]>({
        extensionId,
        key: "folders",
    });

    const addFolderSetting = (folderSetting: FolderSetting) => setFolderSettings([...folderSettings, folderSetting]);

    const removeFolderSetting = (path: string) => setFolderSettings(folderSettings.filter(({ path: p }) => p !== path));

    return (
        <SettingGroupList>
            <SettingGroup title={t("folders")}>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderCell>{t("path")}</TableHeaderCell>
                            <TableHeaderCell style={{ width: 80 }}>{t("recursive")}</TableHeaderCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {folderSettings.map(({ path, recursive }) => (
                            <TableRow key={path}>
                                <TableCell>{path}</TableCell>
                                <TableCell>
                                    <TableCellLayout>{recursive ? "Yes" : ""}</TableCellLayout>
                                    <TableCellActions>
                                        <Tooltip relationship="label" content={t("edit")}>
                                            <Button size="small" icon={<PenRegular />} />
                                        </Tooltip>
                                        <Tooltip relationship="label" content={t("remove")}>
                                            <Button
                                                size="small"
                                                icon={<DismissRegular />}
                                                onClick={() => removeFolderSetting(path)}
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
                            isValidPath: false,
                            path: "",
                            recursive: false,
                        }}
                    />
                </div>
            </SettingGroup>
        </SettingGroupList>
    );
};
