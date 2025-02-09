import { useSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { Switch } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const ShowSearchResultItemIconSettings = () => {
    const { t } = useTranslation("settingsAppearance");

    const { value: showSearchResultItemIcon, updateValue: setShowSearchResultItemIcon } = useSetting({
        key: "appearance.showSearchResultItemIcon",
        defaultValue: true,
    });

    return (
        <Setting
            label={t("showSearchResultItemIcon")}
            control={
                <Switch
                    checked={showSearchResultItemIcon}
                    onChange={(_, { checked }) => setShowSearchResultItemIcon(checked)}
                />
            }
        />
    );
};
