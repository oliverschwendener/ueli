import { getExtensionSettingKey } from "@common/Core/Extension";
import { useState } from "react";
import { useContextBridge } from "./useContextBridge";

export const useExtensionSetting = <T>(
    extensionId: string,
    key: string,
    defaultValue: T,
    onUpdate?: (updatedValue: T) => void,
) => {
    const { contextBridge } = useContextBridge();

    const settingKey = getExtensionSettingKey(extensionId, key);

    const [value, setValue] = useState<T>(contextBridge.getSettingValue(settingKey, defaultValue));

    const updateValue = async (updatedValue: T) => {
        setValue(updatedValue);

        await contextBridge.updateSettingValue(settingKey, updatedValue);

        if (onUpdate) {
            onUpdate(updatedValue);
        }
    };

    return { value, updateValue };
};
