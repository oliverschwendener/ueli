import { Setting } from "@Core/Settings/Setting";
import { Switch } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

type AutomaticRescanProps = {
    automaticRescanEnabled: boolean;
    setAutomaticRescanEnabled: (value: boolean) => void;
};

export const AutomaticRescan = ({ automaticRescanEnabled, setAutomaticRescanEnabled }: AutomaticRescanProps) => {
    const { t } = useTranslation("settingsSearchEngine");

    return (
        <Setting
            label={t("automaticRescan")}
            control={
                <Switch
                    checked={automaticRescanEnabled}
                    onChange={(_, { checked }) => setAutomaticRescanEnabled(checked)}
                />
            }
        />
    );
};
