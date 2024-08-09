import { useSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { SpinButton, Switch } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const SearchHistory = () => {
    const { t } = useTranslation("settingsGeneral");

    const { value: enabled, updateValue: setEnabled } = useSetting({
        key: "general.searchHistory.enabled",
        defaultValue: false,
    });

    const { updateValue: setSearchHistory } = useSetting({ key: "general.searchHistory.history", defaultValue: [] });

    const { value: limit, updateValue: setLimit } = useSetting({
        key: "general.searchHistory.limit",
        defaultValue: 10,
    });

    return (
        <>
            <Setting
                label={t("searchHistoryEnabled")}
                description={t("searchHistoryEnabledDescription")}
                control={
                    <Switch
                        checked={enabled}
                        onChange={(_, { checked }) => {
                            setEnabled(checked);

                            // When search history is disabled we clear the history
                            if (!checked) {
                                setSearchHistory([]);
                            }
                        }}
                    />
                }
            />
            <Setting
                label={t("searchHistoryLimit")}
                description={t("searchHistoryLimitHint")}
                control={
                    <SpinButton
                        type="number"
                        minLength={1}
                        value={limit}
                        onChange={(_, { value }) => value && setLimit(value)}
                        disabled={!enabled}
                    />
                }
            />
        </>
    );
};
