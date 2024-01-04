import type { ExtensionSettingList as ExtensionSettingListType } from "@common/ExtensionSettingsStructure";
import { Button, Input, Label } from "@fluentui/react-components";
import { AddRegular, DismissRegular } from "@fluentui/react-icons";
import { useState } from "react";
import { useSetting } from "../Hooks";

type ExtensionSettingListProps = {
    extensionId: string;
    setting: ExtensionSettingListType;
};

export const ExtensionSettingList = ({ extensionId, setting }: ExtensionSettingListProps) => {
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

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <Label>{setting.description}</Label>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {value.map((v, index) => (
                    <Input
                        key={`${v}-${index}`}
                        readOnly
                        value={v}
                        size="small"
                        contentAfter={
                            <Button
                                onClick={() => remove(index)}
                                appearance="subtle"
                                size="small"
                                icon={<DismissRegular fontSize={14} />}
                            ></Button>
                        }
                    />
                ))}
            </div>
            <Input
                value={newValue}
                onChange={(_, { value: v }) => setNewValue(v)}
                size="small"
                contentAfter={
                    <Button
                        onClick={() => add()}
                        appearance="subtle"
                        size="small"
                        icon={<AddRegular fontSize={14} />}
                    ></Button>
                }
            />
        </div>
    );
};
