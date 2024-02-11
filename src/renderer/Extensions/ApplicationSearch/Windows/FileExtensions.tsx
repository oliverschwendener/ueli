import { useExtensionSetting } from "@Core/Hooks";
import { Button, Field, Input, Tooltip } from "@fluentui/react-components";
import { AddRegular, DismissRegular } from "@fluentui/react-icons";
import { useState } from "react";

export const FileExtensions = () => {
    const [newFileExtension, setNewFileExtension] = useState<string>("");

    const { value: fileExtensions, updateValue: setFileExtensions } = useExtensionSetting<string[]>({
        extensionId: "ApplicationSearch",
        key: "windowsFileExtensions",
    });

    const removeFileExtension = (fileExtension: string) => {
        setFileExtensions(fileExtensions.filter((f) => f !== fileExtension));
    };

    const addFileExtension = (fileExtension: string) => {
        setFileExtensions([...fileExtensions, fileExtension]);
        setNewFileExtension("");
    };

    return (
        <Field label="File Extensions (e.g.: lnk, exe)">
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {fileExtensions.map((fileExtension) => (
                    <Input
                        readOnly
                        value={fileExtension}
                        contentAfter={
                            <Tooltip content="Remove" relationship="label">
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
                    placeholder="Add another file extension"
                    onChange={(_, { value }) => setNewFileExtension(value)}
                    contentAfter={
                        <Tooltip content="Add" relationship="label">
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
        </Field>
    );
};
