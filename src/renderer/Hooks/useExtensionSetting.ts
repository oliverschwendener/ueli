import { useState } from "react";
import { useContextBridge } from "./useContextBridge";

export const useExtensionSetting = <T>(
    extensionId: string,
    key: string,
    defaultValue: T,
    onUpdate?: (updatedValue: T) => void,
) => {
    const { contextBridge } = useContextBridge();

    const [value, setValue] = useState<T>(contextBridge.getExtensionSettingByKey(extensionId, key, defaultValue));

    const updateValue = async (updatedValue: T) => {
        setValue(updatedValue);

        await contextBridge.updateExtensionSettingByKey(extensionId, key, updatedValue);

        if (onUpdate) {
            onUpdate(updatedValue);
        }
    };

    return { value, updateValue };
};
