import { useSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { Button, Input, Switch, Tooltip } from "@fluentui/react-components";
import { ArrowExportRegular, ArrowImportRegular, FolderRegular } from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";

export const SharedConfiguration = () => {
    const { t } = useTranslation("settingsGeneral");

    const { value: enabled, updateValue: setEnabled } = useSetting({
        key: "general.sharedConfiguration.enabled",
        defaultValue: false,
    });

    const { value: configurationFilePath, updateValue: setConfigurationFilePath } = useSetting({
        key: "general.sharedConfiguration.filePath",
        defaultValue: "ueli9.settings.json",
    });

    const chooseFilePath = async () => {
        const { canceled, filePath } = await window.ContextBridge.showSaveDialog({
            defaultPath: configurationFilePath || "ueli9.settings.json",
            properties: ["showOverwriteConfirmation"],
        });

        if (!canceled && filePath.length) {
            setConfigurationFilePath(filePath);
        }
    };

    const importConfiguration = async () => {
        const { canceled, filePaths } = await window.ContextBridge.showOpenDialog({
            defaultPath: "ueli9.settings.json",
            properties: ["openFile"],
        });

        if (!canceled && filePaths.length) {
            await window.ContextBridge.importSettings(filePaths[0]);
        }
    };

    const exportConfiguration = async () => {
        const { canceled, filePath } = await window.ContextBridge.showSaveDialog({
            defaultPath: "ueli9.settings.json",
            properties: ["showOverwriteConfirmation"],
        });

        if (!canceled && filePath.length) {
            await window.ContextBridge.exportSettings(filePath);
        }
    };

    return (
        <>
            <Setting
                label={t("sharedConfigurationEnabled")}
                control={
                    <Switch
                        checked={enabled}
                        onChange={(_, { checked }) => {
                            setEnabled(checked);
                        }}
                    />
                }
            />
            <Setting
                label={t("sharedConfigurationFilePath")}
                control={
                    <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
                        <Input
                            disabled={!enabled}
                            value={configurationFilePath}
                            onChange={(_, { value }) => setConfigurationFilePath(value)}
                            placeholder="ueli9.settings.json"
                            contentAfter={
                                <Tooltip content={t("sharedConfigurationFilePathSelectFile")} relationship="label">
                                    <Button
                                        disabled={!enabled}
                                        size="small"
                                        appearance="subtle"
                                        icon={<FolderRegular />}
                                        onClick={chooseFilePath}
                                    />
                                </Tooltip>
                            }
                        />
                    </div>
                }
            />
            <Setting
                label={t("configurationActions")}
                control={
                    <>
                        <Button onClick={() => importConfiguration()} icon={<ArrowImportRegular />}>
                            {t("importConfiguration")}
                        </Button>
                        <Button
                            style={{ marginLeft: 8 }}
                            onClick={() => exportConfiguration()}
                            icon={<ArrowExportRegular />}
                        >
                            {t("exportConfiguration")}
                        </Button>
                    </>
                }
            />
        </>
    );
};
