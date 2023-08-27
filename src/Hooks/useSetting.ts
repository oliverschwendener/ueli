import { useState } from "react";

export const useSetting = <T>(key: string, defaultValue: T, onUpdate?: () => void) => {
    const [value, setValue] = useState<T>(window.ContextBridge.getSettingByKey(key, defaultValue));

    const updateValue = async (updatedValue: T) => {
        setValue(updatedValue);
        await window.ContextBridge.updateSettingByKey(key, updatedValue);

        if (onUpdate) {
            onUpdate();
        }
    };

    return { value, updateValue };
};
