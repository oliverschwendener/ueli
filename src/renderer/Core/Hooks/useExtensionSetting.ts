import { getExtensionSettingKey } from "@common/Core/Extension";
import { useState } from "react";
import { useContextBridge } from "./useContextBridge";

export const useExtensionSetting = <Value>(
    extensionId: string,
    key: string,
    defaultValue: Value,
    isSensitive?: boolean,
    onUpdate?: (updatedValue: Value) => void,
) => {
    const { contextBridge } = useContextBridge();

    const settingKey = getExtensionSettingKey(extensionId, key);

    const [value, setValue] = useState<Value>(contextBridge.getSettingValue(settingKey, defaultValue, isSensitive));

    const updateValue = async (updatedValue: Value) => {
        setValue(updatedValue);

        await contextBridge.updateSettingValue(settingKey, updatedValue, isSensitive);

        if (onUpdate) {
            onUpdate(updatedValue);
        }
    };

    return { value, updateValue };
};
