import type { CustomSearchEngineSetting, Settings } from "@common/Extensions/CustomWebSearch";
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
import { EditCustomSearchEngine } from "./EditCustomSearchEngine";

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

    const { value: customSearchEngineSettings, updateValue: setCustomSearchEngineSettings } = useExtensionSetting<
        Settings["customSearchEngines"]
    >({
        extensionId,
        key: "customSearchEngines",
    });

    const addCustomSearchEngineSetting = (engineSetting: CustomSearchEngineSetting) =>
        setCustomSearchEngineSettings([...customSearchEngineSettings, engineSetting]);

    const removeCustomSearchEngineSetting = (id: string) =>
        setCustomSearchEngineSettings(customSearchEngineSettings.filter((setting) => setting.id !== id));

    return (
        <SettingGroupList>
            <SettingGroup title={t("folders")}>
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
                                        <Tooltip relationship="label" content={t("remove")}>
                                            <Button
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
                    <EditCustomSearchEngine
                        onSave={addCustomSearchEngineSetting}
                        initialEngineSetting={{
                            ...createCustomSearchEngineSetting(),
                        }}
                    />
                </div>
            </SettingGroup>
        </SettingGroupList>
    );
};
