import { useSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { Label, Slider } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const SearchResultItemNameTextSize = () => {
    const { t } = useTranslation("settingsAppearance");

    const { value: searchResultListItemNameTextSize, updateValue: setSearchResultListItemNameTextSize } = useSetting({
        key: "appearance.searchResultListItemNameTextSize",
        defaultValue: 300,
    });

    return (
        <Setting
            label={t("searchResultListItemNameTextSize")}
            control={
                <>
                    <Label>{searchResultListItemNameTextSize}</Label>
                    <Slider
                        value={searchResultListItemNameTextSize}
                        onChange={(_, { value }) => setSearchResultListItemNameTextSize(value)}
                        step={100}
                        min={100}
                        max={900}
                    />
                </>
            }
        />
    );
};
