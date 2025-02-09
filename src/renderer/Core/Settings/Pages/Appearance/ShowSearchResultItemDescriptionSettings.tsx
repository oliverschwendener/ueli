import { useSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { Badge, type BadgeProps, Dropdown, Option, Switch } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const ShowSearchResultItemDescriptionSettings = () => {
    const { t } = useTranslation("settingsAppearance");

    const { value: showSearchResultItemDescription, updateValue: setShowSearchResultItemDescription } = useSetting({
        key: "appearance.showSearchResultItemDescription",
        defaultValue: true,
    });

    const { value: searchResultItemDescriptionColor, updateValue: setSearchResultItemDescriptionColor } = useSetting({
        key: "appearance.searchResultItemDescriptionColor",
        defaultValue: "subtle",
    });

    const colors: Record<string, string> = {
        subtle: t("searchResultItemDescriptionColor.subtle"),
        brand: t("searchResultItemDescriptionColor.brand"),
        success: t("searchResultItemDescriptionColor.success"),
        danger: t("searchResultItemDescriptionColor.danger"),
        warning: t("searchResultItemDescriptionColor.warning"),
        informative: t("searchResultItemDescriptionColor.informative"),
        important: t("searchResultItemDescriptionColor.important"),
        severe: t("searchResultItemDescriptionColor.severe"),
    };

    return (
        <>
            <Setting
                label={t("showSearchResultItemDescription")}
                control={
                    <Switch
                        checked={showSearchResultItemDescription}
                        onChange={(_, { checked }) => setShowSearchResultItemDescription(checked)}
                    />
                }
            />
            {}
            <Setting
                label={t("searchResultItemDescriptionColor")}
                control={
                    <Dropdown
                        disabled={!showSearchResultItemDescription}
                        value={colors[searchResultItemDescriptionColor]}
                        selectedOptions={[searchResultItemDescriptionColor]}
                        onOptionSelect={(_, { optionValue }) => {
                            if (optionValue) {
                                setSearchResultItemDescriptionColor(optionValue);
                            }
                        }}
                    >
                        {Object.keys(colors).map((key) => (
                            <Option key={key} value={key} text={colors[key]}>
                                <Badge color={key as BadgeProps["color"]}>{colors[key]}</Badge>
                            </Option>
                        ))}
                    </Dropdown>
                }
            />
        </>
    );
};
