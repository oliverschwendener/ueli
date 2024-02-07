import { useState } from "react";
import { useContextBridge } from "./useContextBridge";

export const useSetting = <Value>({
    key,
    defaultValue,
    isSensitive,
    onUpdate,
}: {
    key: string;
    defaultValue: Value;
    isSensitive?: boolean;
    onUpdate?: (updatedValue: Value) => void;
}) => {
    const { contextBridge } = useContextBridge();

    const [value, setValue] = useState<Value>(contextBridge.getSettingValue(key, defaultValue, isSensitive));

    const updateValue = async (updatedValue: Value) => {
        setValue(updatedValue);

        await contextBridge.updateSettingValue(key, updatedValue, isSensitive);

        if (onUpdate) {
            onUpdate(updatedValue);
        }
    };

    return { value, updateValue };
};
