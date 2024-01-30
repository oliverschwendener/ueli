import {
    Accordion,
    AccordionHeader,
    AccordionItem,
    AccordionPanel,
    Badge,
    Button,
    Label,
    Tooltip,
} from "@fluentui/react-components";
import { ArrowClockwiseRegular, CheckmarkFilled, DismissFilled } from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";
import { useContextBridge, useSetting, useTheme } from "../../Hooks";
import { ExtensionSettings } from "./ExtensionSettings";

export const Extensions = () => {
    const { t } = useTranslation();
    const { contextBridge } = useContextBridge();
    const { theme } = useTheme(contextBridge);

    const {
        getAvailableExtensions,
        extensionDisabled: disableExtension,
        extensionEnabled: enableExtension,
    } = contextBridge;

    const { value: enabledExtensionIds, updateValue: setEnabledExtensionIds } = useSetting(
        "extensions.enabledExtensionIds",
        ["ApplicationSearch", "UeliCommand"],
    );

    const isEnabled = (extensionId: string) => enabledExtensionIds.includes(extensionId);

    const enable = async (extensionId: string) => {
        await setEnabledExtensionIds([extensionId, ...enabledExtensionIds]);
        enableExtension(extensionId);
    };

    const disable = async (extensionId: string) => {
        await setEnabledExtensionIds(enabledExtensionIds.filter((p) => p !== extensionId));
        disableExtension(extensionId);
    };

    const toggle = (extensionId: string) => (isEnabled(extensionId) ? disable(extensionId) : enable(extensionId));

    const triggerExtensionRescan = (event: React.MouseEvent, extensionId: string) => {
        event.preventDefault();
        contextBridge.triggerExtensionRescan(extensionId);
    };

    return (
        <Accordion multiple collapsible>
            {getAvailableExtensions().map(({ id, name, nameTranslationKey }) => (
                <AccordionItem
                    key={id}
                    value={id}
                    style={{
                        margin: 10,
                        borderStyle: "solid",
                        borderWidth: "1px",
                        borderColor: theme.colorNeutralStroke3,
                        borderRadius: theme.borderRadiusMedium,
                    }}
                >
                    <AccordionHeader>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: "100%",
                                gap: 5,
                            }}
                        >
                            <div style={{ width: 20, height: 20, display: "flex", alignItems: "center" }}>
                                <img
                                    style={{ maxWidth: "100%", maxHeight: "100%" }}
                                    src={contextBridge.getExtensionImageUrl(id)}
                                />
                            </div>
                            <Label style={{ flexGrow: 1 }}>{nameTranslationKey ? t(nameTranslationKey) : name}</Label>
                            <Tooltip content="Rescan" relationship="label">
                                <Button
                                    onClick={(e) => triggerExtensionRescan(e, id)}
                                    size="small"
                                    appearance="subtle"
                                    icon={<ArrowClockwiseRegular fontSize={14} />}
                                />
                            </Tooltip>
                            <Badge
                                color={isEnabled(id) ? "success" : "subtle"}
                                onClick={async (e) => {
                                    e.preventDefault();
                                    await toggle(id);
                                }}
                                icon={isEnabled(id) ? <CheckmarkFilled /> : <DismissFilled />}
                            >
                                {isEnabled(id) ? "Enabled" : "Disabled"}
                            </Badge>
                        </div>
                    </AccordionHeader>
                    <AccordionPanel>
                        <div style={{ paddingBottom: 15, boxSizing: "border-box" }}>
                            <ExtensionSettings extensionId={id} />
                        </div>
                    </AccordionPanel>
                </AccordionItem>
            ))}
        </Accordion>
    );
};
