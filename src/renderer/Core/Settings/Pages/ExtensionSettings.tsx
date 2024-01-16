import { useTranslation } from "react-i18next";
import { getExtension } from "../../../Extensions";

type ExtensionSettingsProps = {
    extensionId: string;
};

export const ExtensionSettings = ({ extensionId }: ExtensionSettingsProps) => {
    const { t } = useTranslation();

    const result = getExtension(extensionId);

    return (
        result?.settings ?? (
            <div style={{ textAlign: "center", padding: 10, boxSizing: "border-box" }}>
                {t("settings.extensions.noSettingsAvailable")}
            </div>
        )
    );
};
