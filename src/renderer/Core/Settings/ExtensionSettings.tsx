import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { getExtension } from "../../Extensions";

export const ExtensionSettings = () => {
    const { t } = useTranslation();
    const params = useParams();

    const result = params.extensionId ? getExtension(params.extensionId) : null;

    return (
        result?.settings ?? (
            <div
                style={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {t("noSettingsAvailable", { ns: "settingsExtensions" })}
            </div>
        )
    );
};
