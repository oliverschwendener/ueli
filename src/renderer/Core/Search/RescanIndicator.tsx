import { Caption1, Spinner } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const RescanIndicator = () => {
    const { t } = useTranslation("general");

    return (
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Spinner size="extra-tiny" />
            <Caption1>{t("rescanning")}</Caption1>
        </div>
    );
};
