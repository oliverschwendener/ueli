import type { IpcRendererEvent } from "electron";
import { useEffect, useState } from "react";

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

    useEffect(() => {
        const listener = (_: IpcRendererEvent, { value: newValue }: { value: Value }) => {
            setValue(newValue);
        };

        window.ContextBridge.ipcRenderer.on(`settingUpdated[${key}]`, listener);

        return () => {
            window.ContextBridge.ipcRenderer.off(`settingUpdated[${key}]`, listener);
        };
    }, []);

    return { value, updateValue };
};
