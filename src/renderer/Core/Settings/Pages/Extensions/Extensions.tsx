import { useSetting } from "@Core/Hooks";
import { ThemeContext } from "@Core/Theme";
import { Toast, ToastTitle, Toaster, tokens, useId, useToastController } from "@fluentui/react-components";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { ExtensionCard } from "./ExtensionCard";

export const Extensions = () => {
    const { shouldUseDarkColors } = useContext(ThemeContext);
    const { t } = useTranslation();
    const navigate = useNavigate();

    const toasterId = useId("rescanToasterId");
    const { dispatchToast } = useToastController(toasterId);

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
        const { success } = await attemptRescan(extensionId);
        const { name, nameTranslation } = window.ContextBridge.getExtension(extensionId);

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
            <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacingVerticalM }}>
                {window.ContextBridge.getAvailableExtensions().map((extension) => (
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
