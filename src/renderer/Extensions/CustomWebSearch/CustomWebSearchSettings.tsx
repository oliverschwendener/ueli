import type { CustomSearchEngineSetting, Settings } from "@common/Extensions/CustomWebSearch";
import { useExtensionSetting } from "@Core/Hooks";
import { SettingGroup } from "@Core/Settings/SettingGroup";
import { SettingGroupList } from "@Core/Settings/SettingGroupList";
import {
    Button,
    DialogTrigger,
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
import { AddRegular, CheckmarkRegular, DismissRegular, EditRegular } from "@fluentui/react-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CustomWebSearchDialog } from "./CustomWebSearchDialog";

const createCustomSearchEngineSetting = (): CustomSearchEngineSetting => ({
    id: crypto.randomUUID(),
    name: "",
    prefix: "",
    url: "",
    encodeSearchTerm: true,
});

export const CustomWebSearchSettings = () => {
    const extensionId = "CustomWebSearch";

    const { t } = useTranslation("extension[CustomWebSearch]");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentEngineSettings, setCurrentEngineSettings] = useState(createCustomSearchEngineSetting());

    const { value: customSearchEngineSettings, updateValue: setCustomSearchEngineSettings } = useExtensionSetting<
        Settings["customSearchEngines"]
    >({
        extensionId,
        key: "customSearchEngines",
    });

    const editCustomSearchEngineSetting = (engineSetting: CustomSearchEngineSetting) => {
        if (!customSearchEngineSettings.some((setting) => setting.id === engineSetting.id)) {
            setCustomSearchEngineSettings([...customSearchEngineSettings, engineSetting]);
        } else {
            setCustomSearchEngineSettings([
                ...customSearchEngineSettings.map((setting) =>
                    setting.id === engineSetting.id ? engineSetting : setting,
                ),
            ]);
        }
    };

    const removeCustomSearchEngineSetting = (id: string) =>
        setCustomSearchEngineSettings(customSearchEngineSettings.filter((setting) => setting.id !== id));

    const openEditDialog = (id?: string) => {
        if (id === undefined) {
            setCurrentEngineSettings(createCustomSearchEngineSetting());
        } else {
            const setting = customSearchEngineSettings.find((setting) => setting.id === id);
            if (setting) {
                setCurrentEngineSettings(setting);
            }
        }
        setIsDialogOpen(true);
    };

    return (
        <SettingGroupList>
            <SettingGroup title={t("searchEngines")}>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderCell style={{ width: 120 }}>{t("name")}</TableHeaderCell>
                            <TableHeaderCell style={{ width: 80 }}>{t("prefix")}</TableHeaderCell>
                            <TableHeaderCell>{t("url")}</TableHeaderCell>
                            <TableHeaderCell style={{ width: 80 }}>{t("encodeSearchTerm")}</TableHeaderCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {customSearchEngineSettings.map(({ id, name, prefix, url, encodeSearchTerm }) => (
                            <TableRow key={name}>
                                <TableCell>{name}</TableCell>
                                <TableCell>{prefix}</TableCell>
                                <TableCell style={{ overflow: "hidden" }}>{url}</TableCell>
                                <TableCell>
                                    <TableCellLayout
                                        style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}
                                    >
                                        {encodeSearchTerm ? <CheckmarkRegular /> : ""}
                                    </TableCellLayout>
                                    <TableCellActions>
                                        <Tooltip relationship="label" content={t("edit")}>
                                            <Button
                                                size="small"
                                                icon={<EditRegular />}
                                                onClick={() => openEditDialog(id)}
                                            />
                                        </Tooltip>
                                        <Tooltip relationship="label" content={t("remove")}>
                                            <Button
                                                style={{ marginLeft: 4 }}
                                                size="small"
                                                icon={<DismissRegular />}
                                                onClick={() => removeCustomSearchEngineSetting(id)}
                                            />
                                        </Tooltip>
                                    </TableCellActions>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div>
                    <DialogTrigger disableButtonEnhancement>
                        <Button onClick={() => openEditDialog()} icon={<AddRegular />}>
                            {t("addSearchEngine")}
                        </Button>
                    </DialogTrigger>
                    <CustomWebSearchDialog
                        isDialogOpen={isDialogOpen}
                        closeDialog={() => setIsDialogOpen(false)}
                        onSave={editCustomSearchEngineSetting}
                        initialEngineSetting={{ ...currentEngineSettings }}
                    />
                </div>
            </SettingGroup>
        </SettingGroupList>
    );
};
