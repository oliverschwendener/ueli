import { useSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { Switch } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const ToggleOnSecondInstance = () => {
    const { t } = useTranslation("settingsWindow");
    const { value, updateValue } = useSetting({ key: "window.toggleOnSecondInstance", defaultValue: true });

    return (
        <Setting
            label={t("toggleOnSecondInstance")}
            description={t("toggleOnSecondInstanceDescription")}
            control={<Switch checked={value} onChange={(_, { checked }) => updateValue(checked)} />}
        />
    );
};
