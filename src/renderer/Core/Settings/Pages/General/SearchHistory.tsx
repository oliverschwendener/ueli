import { useSetting } from "@Core/Hooks";
import { Section } from "@Core/Settings/Section";
import { Field, SpinButton, Switch } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const SearchHistory = () => {
    const ns = "settingsGeneral";
    const { t } = useTranslation();

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
            <Section>
                <Switch
                    label={t("searchHistoryEnabled", { ns })}
                    checked={enabled}
                    onChange={(_, { checked }) => {
                        setEnabled(checked);

                        // When search history is disabled we clear the history
                        !checked && setSearchHistory([]);
                    }}
                />
            </Section>
            {enabled && (
                <Section>
                    <Field>
                        <SpinButton
                            type="number"
                            minLength={1}
                            value={limit}
                            onChange={(_, { value }) => value && setLimit(value)}
                        />
                    </Field>
                </Section>
            )}
        </>
    );
};
