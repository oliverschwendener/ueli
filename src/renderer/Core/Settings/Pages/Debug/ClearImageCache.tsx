import { Setting } from "@Core/Settings/Setting";
import { Button, type ButtonProps, Spinner, tokens } from "@fluentui/react-components";
import { CheckmarkRegular, DismissRegular } from "@fluentui/react-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";

type LoadingState = "idle" | "loading" | "success" | "error";

export const ClearImageCache = () => {
    const { t } = useTranslation("settingsDebug");
    const [loadingState, setLoadingState] = useState<LoadingState>("idle");

    const clearImageCache = async () => {
        setLoadingState("loading");

        try {
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate a delay for the loading spinner
            await window.ContextBridge.ipcRenderer.invoke("clearImageCache");
            setLoadingState("success");
        } catch (error) {
            setLoadingState("error");
        }
    };

    const buttonIcon: Record<LoadingState, ButtonProps["icon"]> = {
        loading: <Spinner size="extra-tiny" />,
        success: <CheckmarkRegular color={tokens.colorStatusSuccessForeground1} />,
        error: <DismissRegular color={tokens.colorStatusDangerForeground1} />,
        idle: undefined,
    };

    return (
        <Setting
            label={t("clearImageCache")}
            description={t("clearImageCacheHint")}
            control={
                <Button iconPosition="after" icon={buttonIcon[loadingState]} onClick={clearImageCache}>
                    {t(`clearImageCacheButton.${loadingState}`)}
                </Button>
            }
        />
    );
};
