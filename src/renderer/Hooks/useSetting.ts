import { useState } from "react";
import { useContextBridge } from "./useContextBridge";

export const useSetting = <T>(key: string, defaultValue: T, onUpdate?: (updatedValue: T) => void) => {
    const { contextBridge } = useContextBridge();

    const [value, setValue] = useState<T>(contextBridge.getSettingByKey(key, defaultValue));

    const updateValue = async (updatedValue: T) => {
        setValue(updatedValue);

        await contextBridge.updateSettingByKey(key, updatedValue);

        if (onUpdate) {
            onUpdate(updatedValue);
        }
    };

    return { value, updateValue };
};
