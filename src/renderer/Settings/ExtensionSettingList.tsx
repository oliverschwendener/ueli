import type { ExtensionSettingList as ExtensionSettingListType } from "@common/ExtensionSettingsStructure";
import { Button, Input, Label, Tooltip } from "@fluentui/react-components";
import { AddRegular, DismissRegular, FolderRegular } from "@fluentui/react-icons";
import { useState } from "react";
import { useContextBridge, useSetting } from "../Hooks";

type ExtensionSettingListProps = {
    extensionId: string;
    setting: ExtensionSettingListType;
};

export const ExtensionSettingList = ({ extensionId, setting }: ExtensionSettingListProps) => {
    const { contextBridge } = useContextBridge();
    const { value, updateValue } = useSetting(`extension[${extensionId}].${setting.id}`, setting.defaultValues);

    const [newValue, setNewValue] = useState<string>("");

    const remove = (indexToRemove: number) => {
        updateValue(value.filter((_, index) => index !== indexToRemove));
    };

    const add = () => {
        if (newValue.trim().length) {
            updateValue([...value, newValue]);
            setNewValue("");
        }
    };

    const chooseFolder = async () => {
        try {
            const result = await contextBridge.showOpenDialog(setting.openDialogOptions ?? {});
            if (!result.canceled && result.filePaths.length) {
                setNewValue(result.filePaths[0]);
            }
        } catch (error) {
            // do nothing
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <Label size="small">{setting.description}</Label>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {value.map((v, index) => (
                    <Input
                        key={`${v}-${index}`}
                        readOnly
                        value={v}
                        size="small"
                        contentAfter={
                            <Tooltip content="Remove" relationship="label">
                                <Button
                                    onClick={() => remove(index)}
                                    appearance="subtle"
                                    size="small"
                                    icon={<DismissRegular fontSize={14} />}
                                ></Button>
                            </Tooltip>
                        }
                    />
                ))}
            </div>
            <Input
                placeholder={setting.newValuePlaceholder}
                value={newValue}
                onChange={(_, { value: v }) => setNewValue(v)}
                size="small"
                contentAfter={
                    <>
                        {setting.openDialogOptions ? (
                            <Tooltip content="Choose folder" relationship="label">
                                <Button
                                    onClick={chooseFolder}
                                    appearance="subtle"
                                    size="small"
                                    icon={<FolderRegular />}
                                />
                            </Tooltip>
                        ) : null}
                        <Tooltip content="Add" relationship="label">
                            <Button
                                onClick={() => add()}
                                appearance="subtle"
                                size="small"
                                icon={<AddRegular fontSize={14} />}
                            />
                        </Tooltip>
                    </>
                }
            />
        </div>
    );
};
