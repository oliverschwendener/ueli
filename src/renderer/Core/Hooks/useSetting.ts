import { useState } from "react";

export const useSetting = <Value>({
    key,
    defaultValue,
    isSensitive,
}: {
    key: string;
    defaultValue: Value;
    isSensitive?: boolean;
}) => {
    const [value, setValue] = useState<Value>(window.ContextBridge.getSettingValue(key, defaultValue, isSensitive));

    const updateValue = async (updatedValue: Value) => {
        setValue(updatedValue);
        await window.ContextBridge.updateSettingValue(key, updatedValue, isSensitive);
    };

    return { value, updateValue };
};
