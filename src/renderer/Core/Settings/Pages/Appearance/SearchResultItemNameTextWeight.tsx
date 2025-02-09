import { useSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { Dropdown, Option, type TextProps } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const SearchResultItemNameTextWeight = () => {
    const { t } = useTranslation("settingsAppearance");

    const { value: searchResultListItemNameTextWeight, updateValue: setSearchResultListItemNameTextWeight } =
        useSetting<TextProps["weight"]>({
            key: "appearance.searchResultListItemNameTextWeight",
            defaultValue: "semibold",
        });

    const options: Record<string, string> = {
        regular: t("searchResultListItemNameTextWeight.regular"),
        medium: t("searchResultListItemNameTextWeight.medium"),
        semibold: t("searchResultListItemNameTextWeight.semibold"),
        bold: t("searchResultListItemNameTextWeight.bold"),
    };

    return (
        <Setting
            label={t("searchResultListItemNameTextWeight")}
            control={
                <Dropdown
                    value={options[searchResultListItemNameTextWeight as string]}
                    selectedOptions={[searchResultListItemNameTextWeight as string]}
                    onOptionSelect={(_, { optionValue }) => {
                        if (optionValue) {
                            setSearchResultListItemNameTextWeight(optionValue as TextProps["weight"]);
                        }
                    }}
                >
                    {Object.keys(options).map((key) => (
                        <Option key={key} value={key}>
                            {options[key]}
                        </Option>
                    ))}
                </Dropdown>
            }
        />
    );
};
