import { getExtensionSettingKey } from "@common/Core/Extension";
import { useState } from "react";
import { useContextBridge } from "./useContextBridge";

export const useExtensionSetting = <Value>({
    extensionId,
    key,
    isSensitive,
}: {
    extensionId: string;
    key: string;
    isSensitive?: boolean;
}) => {
    const { contextBridge } = useContextBridge();

    const settingKey = getExtensionSettingKey(extensionId, key);

    const [value, setValue] = useState<Value>(
        contextBridge.getSettingValue(
            settingKey,
            contextBridge.getExtensionSettingDefaultValue(extensionId, key),
            isSensitive,
        ),
    );

    const updateValue = async (updatedValue: Value) => {
        setValue(updatedValue);

        await contextBridge.updateSettingValue(settingKey, updatedValue, isSensitive);
    };

    return { value, updateValue };
};
