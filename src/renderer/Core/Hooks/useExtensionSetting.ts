import { getExtensionSettingKey } from "@common/Core/Extension";
import { useSetting } from "./useSetting";

export const useExtensionSetting = <Value>({
    extensionId,
    key,
    isSensitive,
}: {
    extensionId: string;
    key: string;
    isSensitive?: boolean;
}) => {
    const { value, updateValue } = useSetting<Value>({
        key: getExtensionSettingKey(extensionId, key),
        defaultValue: window.ContextBridge.getExtensionSettingDefaultValue(extensionId, key),
        isSensitive,
    });

    console.log("rerender", getExtensionSettingKey(extensionId, key));

    return { value, updateValue };
};
