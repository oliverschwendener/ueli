import { useExtensionSetting } from "@Core/Hooks";
import { Button, Input, Tooltip } from "@fluentui/react-components";
import { AddRegular, DismissRegular } from "@fluentui/react-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const FileExtensions = () => {
    const { t } = useTranslation("extension[ApplicationSearch]");

    const [newFileExtension, setNewFileExtension] = useState<string>("");

    const { value: fileExtensions, updateValue: setFileExtensions } = useExtensionSetting<string[]>({
        extensionId: "ApplicationSearch",
        key: "windowsFileExtensions",
    });

    const removeFileExtension = async (fileExtension: string) => {
        await setFileExtensions(fileExtensions.filter((f) => f !== fileExtension));
    };

    const addFileExtension = async (fileExtension: string) => {
        await setFileExtensions([...fileExtensions, fileExtension]);
        setNewFileExtension("");
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {fileExtensions.map((fileExtension) => (
                <Input
                    readOnly
                    value={fileExtension}
                    contentAfter={
                        <Tooltip content={t("remove")} relationship="label" withArrow>
                            <Button
                                size="small"
                                appearance="subtle"
                                icon={<DismissRegular />}
                                onClick={() => removeFileExtension(fileExtension)}
                            />
                        </Tooltip>
                    }
                />
            ))}
            <Input
                value={newFileExtension}
                placeholder={t("addFileExtension")}
                onChange={(_, { value }) => setNewFileExtension(value)}
                contentAfter={
                    <Tooltip content={t("add")} relationship="label" withArrow>
                        <Button
                            appearance="subtle"
                            size="small"
                            icon={<AddRegular />}
                            onClick={() => addFileExtension(newFileExtension)}
                        />
                    </Tooltip>
                }
            />
        </div>
    );
};
