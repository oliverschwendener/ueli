import { useSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { Label, Slider } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const SearchResultItemDetailsTextSize = () => {
    const { t } = useTranslation("settingsAppearance");

    const { value: searchResultListItemDetailsTextSize, updateValue: setSearchResultListItemDetailsTextSize } =
        useSetting({
            key: "appearance.searchResultListItemDetailsTextSize",
            defaultValue: 200,
        });

    return (
        <Setting
            label={t("searchResultListItemDetailsTextSize")}
            control={
                <>
                    <Label>{searchResultListItemDetailsTextSize}</Label>
                    <Slider
                        value={searchResultListItemDetailsTextSize}
                        onChange={(_, { value }) => setSearchResultListItemDetailsTextSize(value)}
                        step={100}
                        min={100}
                        max={900}
                    />
                </>
            }
        />
    );
};
