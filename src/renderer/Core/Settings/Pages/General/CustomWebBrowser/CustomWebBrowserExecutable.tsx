import { useSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { Button, Input, Tooltip } from "@fluentui/react-components";
import { FolderRegular } from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";

type CustomWebBrowserProps = {
    useDefaultWebBrowser: boolean;
};

export const CustomWebBrowserExecutable = ({ useDefaultWebBrowser }: CustomWebBrowserProps) => {
    const { t } = useTranslation("settingsGeneral");

    const { value, updateValue } = useSetting({
        defaultValue: "",
        key: "general.browser.customWebBrowser.executableFilePath",
    });

    const chooseFile = async () => {
        const { canceled, filePaths } = await window.ContextBridge.showOpenDialog({ properties: ["openFile"] });

        if (!canceled && filePaths.length) {
            updateValue(filePaths[0]);
        }
    };

    return (
        <Setting
            label={t("customWebBrowserExecutableFilePath")}
            control={
                <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
                    <Input
                        disabled={useDefaultWebBrowser}
                        value={value}
                        onChange={(_, { value }) => updateValue(value)}
                        placeholder="C:\Program Files\Mozilla Firefox\firefox.exe"
                        contentAfter={
                            <Tooltip content={t("customWebBrowserExecutableFilePathSelectFile")} relationship="label">
                                <Button
                                    disabled={useDefaultWebBrowser}
                                    size="small"
                                    appearance="subtle"
                                    icon={<FolderRegular />}
                                    onClick={chooseFile}
                                />
                            </Tooltip>
                        }
                    />
                </div>
            }
        />
    );
};
