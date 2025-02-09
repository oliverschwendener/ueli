import { SettingGroup } from "@Core/Settings/SettingGroup";
import { useTranslation } from "react-i18next";
import { SearchResultItemDetailsTextSize } from "./SearchResultItemDetailsTextSize";
import { SearchResultItemNameTextSize } from "./SearchResultItemNameTextSize";
import { SearchResultItemNameTextWeight } from "./SearchResultItemNameTextWeight";
import { SearchResultListLayoutSettings } from "./SearchResultListLayoutSettings";
import { ShowSearchResultItemDescriptionSettings } from "./ShowSearchResultItemDescriptionSettings";
import { ShowSearchResultItemIconSettings } from "./ShowSearchResultItemIconSettings";

export const SearchResultListSettings = () => {
    const { t } = useTranslation("settingsAppearance");

    return (
        <SettingGroup title={t("searchResultList")}>
            <SearchResultListLayoutSettings />
            <ShowSearchResultItemIconSettings />
            <ShowSearchResultItemDescriptionSettings />
            <SearchResultItemNameTextSize />
            <SearchResultItemNameTextWeight />
            <SearchResultItemDetailsTextSize />
        </SettingGroup>
    );
};
