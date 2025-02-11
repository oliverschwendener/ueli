import { useTranslation } from "react-i18next";

export const NoResultsFound = ({ searchTerm }: { searchTerm: string }) => {
    const { t } = useTranslation("search");

    const noResultsFoundMessage = searchTerm
        ? `${t("noResultsFoundFor", { ns: "search" })} "${searchTerm}"`
        : t("noResultsFound", { ns: "search" });

    return (
        <div
            style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            {noResultsFoundMessage}
        </div>
    );
};
