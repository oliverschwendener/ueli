import { useSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { Switch } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const AlwaysOnTop = () => {
    const { t } = useTranslation("settingsWindow");
    const { value, updateValue } = useSetting({ key: "window.alwaysOnTop", defaultValue: false });

    return (
        <Setting
            label={t("alwaysOnTop")}
            control={<Switch checked={value} onChange={(_, { checked }) => updateValue(checked)} />}
        />
    );
};
