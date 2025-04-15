import type { OpenFileActionArgs } from "@common/Extensions/Workflow";
import { Button, Field, Input, Tooltip } from "@fluentui/react-components";
import { DocumentRegular, FolderRegular } from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";
import type { NewActionTypeProps } from "./NewActionTypeProps";

export const NewActionOpenFile = ({ args, setArgs }: NewActionTypeProps) => {
    const { t } = useTranslation("extension[Workflow]");

    const { filePath } = args as OpenFileActionArgs;

    const setFilePath = (filePath: string) => setArgs({ filePath });

    const selectFile = async ({ properties }: Electron.OpenDialogOptions) => {
        const result = await window.ContextBridge.showOpenDialog({ properties });

        if (!result.canceled && result.filePaths.length > 0) {
            setFilePath(result.filePaths[0]);
        }
    };

    return (
        <Field label={t(`argType.OpenFile`)}>
            <Input
                value={filePath}
                onChange={(_, { value }) => setFilePath(value)}
                contentAfter={
                    <>
                        <Tooltip content={t("selectFile")} relationship="label">
                            <Button
                                size="small"
                                icon={<DocumentRegular fontSize={14} />}
                                appearance="subtle"
                                onClick={() => selectFile({ properties: ["openFile"] })}
                            ></Button>
                        </Tooltip>
                        <Tooltip content={t("selectFolder")} relationship="label">
                            <Button
                                size="small"
                                icon={<FolderRegular fontSize={14} />}
                                appearance="subtle"
                                onClick={() => selectFile({ properties: ["openDirectory"] })}
                            ></Button>
                        </Tooltip>
                    </>
                }
                placeholder={t(`argType.OpenFile.placeholder`)}
                size="small"
            />
        </Field>
    );
};
