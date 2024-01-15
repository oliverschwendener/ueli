import type { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { ApplicationSearchSettings } from "./ApplicationSearch";
import { DeeplTranslatorSettings } from "./DeeplTranslator";

type ExtensionSettingsProps = {
    extensionId: string;
};

export const ExtensionSettings = ({ extensionId }: ExtensionSettingsProps) => {
    const { t } = useTranslation();

    const map: Record<string, ReactElement> = {
        ApplicationSearch: <ApplicationSearchSettings />,
        DeeplTranslator: <DeeplTranslatorSettings />,
    };

    return (
        map[extensionId] ?? (
            <div style={{ textAlign: "center", padding: 10, boxSizing: "border-box" }}>
                {t("settings.extensions.noSettingsAvailable")}
            </div>
        )
    );
};
