import { useState } from "react";
import { useContextBridge } from "./useContextBridge";

export const useSetting = <Value>({
    key,
    defaultValue,
    isSensitive,
}: {
    key: string;
    defaultValue: Value;
    isSensitive?: boolean;
}) => {
    const { contextBridge } = useContextBridge();

    const [value, setValue] = useState<Value>(contextBridge.getSettingValue(key, defaultValue, isSensitive));

    const updateValue = async (updatedValue: Value) => {
        setValue(updatedValue);
        await contextBridge.updateSettingValue(key, updatedValue, isSensitive);
    };

    return { value, updateValue };
};
