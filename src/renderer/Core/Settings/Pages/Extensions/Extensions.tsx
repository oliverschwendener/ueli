import { useSetting } from "@Core/Hooks";
import { ThemeContext } from "@Core/Theme";
import {
    Spinner,
    Tab,
    TabList,
    Title3,
    Toast,
    ToastTitle,
    Toaster,
    tokens,
    useId,
    useToastController,
} from "@fluentui/react-components";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { ExtensionCard } from "./ExtensionCard";

export const Extensions = () => {
    const { shouldUseDarkColors } = useContext(ThemeContext);
    const [selectedTab, setSelectedTab] = useState("enabled");
    const { t } = useTranslation();
    const navigate = useNavigate();

    const toasterId = useId("rescanToasterId");
    const { dispatchToast, dismissToast } = useToastController(toasterId);

    const { value: enabledExtensionIds, updateValue: setEnabledExtensionIds } = useSetting({
        key: "extensions.enabledExtensionIds",
        defaultValue: ["ApplicationSearch", "UeliCommand"],
    });

    const isEnabled = (extensionId: string) => enabledExtensionIds.includes(extensionId);

    const enable = async (extensionId: string) => {
        await setEnabledExtensionIds([extensionId, ...enabledExtensionIds]);
        window.ContextBridge.extensionEnabled(extensionId);
    };

    const disable = async (extensionId: string) => {
        await setEnabledExtensionIds(enabledExtensionIds.filter((p) => p !== extensionId));
        window.ContextBridge.extensionDisabled(extensionId);
    };

    const attemptRescan = async (extensionId: string): Promise<{ success: boolean }> => {
        try {
            await window.ContextBridge.triggerExtensionRescan(extensionId);
            return { success: true };
        } catch (error) {
            return { success: false };
        }
    };

    const triggerExtensionRescan = async (extensionId: string) => {
        const { name, nameTranslation } = window.ContextBridge.getExtension(extensionId);

        const scanningToastId = crypto.randomUUID();

        dispatchToast(
            <Toast>
                <ToastTitle media={<Spinner size="tiny" />}>
                    {nameTranslation ? t(nameTranslation.key, { ns: nameTranslation.namespace }) : name}:{" "}
                    {t("rescanning", { ns: "settingsExtensions" })}
                </ToastTitle>
            </Toast>,
            {
                toastId: scanningToastId,
                position: "bottom",
                timeout: -1 /* Negative timeout makes the toast stay forever */,
            },
        );

        const { success } = await attemptRescan(extensionId);

        dismissToast(scanningToastId);

        dispatchToast(
            <Toast>
                <ToastTitle>
                    {nameTranslation ? t(nameTranslation.key, { ns: nameTranslation.namespace }) : name}:{" "}
                    {success
                        ? t("successfulRescan", { ns: "settingsExtensions" })
                        : t("failedRescan", { ns: "settingsExtensions" })}
                </ToastTitle>
            </Toast>,
            { intent: success ? "success" : "error", position: "bottom" },
        );
    };

    const openSettings = (extensionId: string) => navigate(`/extension/${extensionId}`);

    const openReadme = (extensionId: string) =>
        window.ContextBridge.openExternal(
            `https://github.com/oliverschwendener/ueli/blob/v${window.ContextBridge.getAboutUeli().version}/docs/Extensions/${extensionId}/README.md`,
        );

    return (
        <>
            <Toaster toasterId={toasterId} />

            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: tokens.spacingVerticalM,
                }}
            >
                <Title3>{t("title", { ns: "settingsExtensions" })}</Title3>
                <TabList
                    selectedValue={selectedTab}
                    onTabSelect={(_, { value }) => {
                        if (typeof value === "string") {
                            setSelectedTab(value);
                        }
                    }}
                >
                    <Tab value="enabled">{t("enabled", { ns: "settingsExtensions" })}</Tab>
                    <Tab value="available">{t("available", { ns: "settingsExtensions" })}</Tab>
                </TabList>
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: tokens.spacingHorizontalM,
                }}
            >
                {window.ContextBridge.getAvailableExtensions()
                    .filter((extension) =>
                        selectedTab === "enabled" ? isEnabled(extension.id) : !isEnabled(extension.id),
                    )
                    .map((extension) => (
                        <ExtensionCard
                            extension={extension}
                            isEnabled={isEnabled(extension.id)}
                            enable={() => enable(extension.id)}
                            disable={() => disable(extension.id)}
                            openSettings={() => openSettings(extension.id)}
                            rescan={() => triggerExtensionRescan(extension.id)}
                            openReadme={() => openReadme(extension.id)}
                            shouldUseDarkColors={shouldUseDarkColors}
                        />
                    ))}
            </div>
        </>
    );
};
