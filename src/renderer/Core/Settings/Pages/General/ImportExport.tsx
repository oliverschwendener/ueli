import { Setting } from "@Core/Settings/Setting";
import { Button } from "@fluentui/react-components";
import { ArrowExportRegular, ArrowImportRegular } from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";

export const ImportExport = () => {
    const { t } = useTranslation("settingsGeneral");

    const importSettings = async () => {
        const { canceled, filePaths } = await window.ContextBridge.showOpenDialog({
            defaultPath: "ueli9.settings.json",
            properties: ["openFile"],
            filters: [{ name: "JSON", extensions: ["json"] }],
        });

        if (!canceled && filePaths.length) {
            await window.ContextBridge.importSettings(filePaths[0]);
        }
    };

    const exportSettings = async () => {
        const { canceled, filePath } = await window.ContextBridge.showSaveDialog({
            defaultPath: "ueli9.settings.json",
            properties: ["showOverwriteConfirmation"],
        });

        if (!canceled && filePath.length) {
            await window.ContextBridge.exportSettings(filePath);
        }
    };

    return (
        <Setting
            label={t("importExportDescription")}
            control={
                <div style={{ display: "flex", flexDirection: "row", gap: 8 }}>
                    <Button onClick={() => importSettings()} icon={<ArrowImportRegular />}>
                        {t("importSettings")}
                    </Button>
                    <Button onClick={() => exportSettings()} icon={<ArrowExportRegular />}>
                        {t("exportSettings")}
                    </Button>
                </div>
            }
        />
    );
};
