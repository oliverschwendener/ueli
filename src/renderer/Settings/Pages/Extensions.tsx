import { Checkbox } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { useContextBridge, useSetting } from "../../Hooks";
import { SectionList } from "../SectionList";

export const Extensions = () => {
    const { t } = useTranslation();
    const { contextBridge } = useContextBridge();

    const {
        getAvailableExtensions,
        extensionDisabled: disableExtension,
        extensionEnabled: enableExtension,
    } = contextBridge;

    const { value: enabledExtensionIds, updateValue: setEnabledExtensionIds } = useSetting(
        "extensions.enabledExtensionIds",
        ["ApplicationSearch"],
    );

    const enable = (extensionId: string) => {
        setEnabledExtensionIds([extensionId, ...enabledExtensionIds]);
        enableExtension(extensionId);
    };

    const disable = (extensionId: string) => {
        setEnabledExtensionIds(enabledExtensionIds.filter((p) => p !== extensionId));
        disableExtension(extensionId);
    };

    return (
        <SectionList>
            <div style={{ display: "flex", flexDirection: "column" }}>
                {getAvailableExtensions().map(({ id, name, nameTranslationKey }) => (
                    <Checkbox
                        key={id}
                        checked={enabledExtensionIds.includes(id)}
                        onChange={(_, { checked }) => (checked ? enable(id) : disable(id))}
                        label={nameTranslationKey ? t(nameTranslationKey) : name}
                    />
                ))}
            </div>
        </SectionList>
    );
};
