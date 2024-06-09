import { useSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { Switch } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const AlwaysCenter = () => {
    const { t } = useTranslation("settingsWindow");

    const { value: alwaysCenter, updateValue: setAlwaysCenter } = useSetting({
        key: "window.alwaysCenter",
        defaultValue: false,
    });

    return (
        <Setting
            label={t("alwaysCenter")}
            control={<Switch checked={alwaysCenter} onChange={(_, { checked }) => setAlwaysCenter(checked)} />}
        />
    );
};
