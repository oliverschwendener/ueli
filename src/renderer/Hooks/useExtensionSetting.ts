import { getExtensionSettingKey } from "@common/Core/Extension";
import { useState } from "react";
import { useContextBridge } from "./useContextBridge";

export const useExtensionSetting = <T>(
    extensionId: string,
    key: string,
    defaultValue: T,
    isSensitive?: boolean,
    onUpdate?: (updatedValue: T) => void,
) => {
    const { contextBridge } = useContextBridge();

    const settingKey = getExtensionSettingKey(extensionId, key);

    const [value, setValue] = useState<T>(contextBridge.getSettingValue(settingKey, defaultValue, isSensitive));

    const updateValue = async (updatedValue: T) => {
        setValue(updatedValue);

        await contextBridge.updateSettingValue(settingKey, updatedValue, isSensitive);

        if (onUpdate) {
            onUpdate(updatedValue);
        }
    };

    return { value, updateValue };
};
