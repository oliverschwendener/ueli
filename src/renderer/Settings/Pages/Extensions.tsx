import { Accordion, AccordionHeader, AccordionItem, AccordionPanel } from "@fluentui/react-components";
import { CheckboxCheckedFilled, CheckboxUncheckedRegular } from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";
import { useContextBridge, useSetting } from "../../Hooks";
import { ExtensionSettings } from "./ExtensionSettings";

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

    const enable = async (extensionId: string) => {
        await setEnabledExtensionIds([extensionId, ...enabledExtensionIds]);
        enableExtension(extensionId);
    };

    const disable = async (extensionId: string) => {
        await setEnabledExtensionIds(enabledExtensionIds.filter((p) => p !== extensionId));
        disableExtension(extensionId);
    };

    return (
        <Accordion
            openItems={enabledExtensionIds}
            onToggle={(_, { value }) =>
                enabledExtensionIds.includes(value as string) ? disable(value as string) : enable(value as string)
            }
            multiple
            collapsible
        >
            {getAvailableExtensions().map(({ id, name, nameTranslationKey }) => (
                <AccordionItem key={id} value={id}>
                    <AccordionHeader
                        expandIcon={
                            enabledExtensionIds.includes(id) ? <CheckboxCheckedFilled /> : <CheckboxUncheckedRegular />
                        }
                    >
                        {nameTranslationKey ? t(nameTranslationKey) : name}
                    </AccordionHeader>
                    <AccordionPanel>
                        <ExtensionSettings extensionId={id} />
                    </AccordionPanel>
                </AccordionItem>
            ))}
        </Accordion>
    );
};
