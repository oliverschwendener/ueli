import { getExtensionSettingKey } from "@common/Core/Extension";
import { useState } from "react";

export const useExtensionSetting = <Value>({
    extensionId,
    key,
    isSensitive,
}: {
    extensionId: string;
    key: string;
    isSensitive?: boolean;
}) => {
    const settingKey = getExtensionSettingKey(extensionId, key);

    const [value, setValue] = useState<Value>(
        window.ContextBridge.getSettingValue(
            settingKey,
            window.ContextBridge.getExtensionSettingDefaultValue(extensionId, key),
            isSensitive,
        ),
    );

    const updateValue = async (updatedValue: Value) => {
        setValue(updatedValue);

        await window.ContextBridge.updateSettingValue(settingKey, updatedValue, isSensitive);
    };

    return { value, updateValue };
};
