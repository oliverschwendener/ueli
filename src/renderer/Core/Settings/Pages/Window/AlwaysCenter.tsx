import { useSetting } from "@Core/Hooks";
import { Switch } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const AlwaysCenter = () => {
    const { t } = useTranslation("settingsWindow");

    const { value: alwaysCenter, updateValue: setAlwaysCenter } = useSetting({
        key: "window.alwaysCenter",
        defaultValue: false,
    });

    return (
        <Switch
            label={t("alwaysCenter")}
            checked={alwaysCenter}
            onChange={(_, { checked }) => setAlwaysCenter(checked)}
        />
    );
};
