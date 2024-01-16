import { useState } from "react";
import { useContextBridge } from "./useContextBridge";

export const useSetting = <T>(
    key: string,
    defaultValue: T,
    isSensitive?: boolean,
    onUpdate?: (updatedValue: T) => void,
) => {
    const { contextBridge } = useContextBridge();

    const [value, setValue] = useState<T>(contextBridge.getSettingValue(key, defaultValue, isSensitive));

    const updateValue = async (updatedValue: T) => {
        setValue(updatedValue);

        await contextBridge.updateSettingValue(key, updatedValue, isSensitive);

        if (onUpdate) {
            onUpdate(updatedValue);
        }
    };

    return { value, updateValue };
};
