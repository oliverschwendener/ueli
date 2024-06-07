import { useSetting } from "@Core/Hooks";
import { Switch } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const ShowOnStartup = () => {
    const { t } = useTranslation("settingsWindow");

    const { value, updateValue } = useSetting({ key: "window.showOnStartup", defaultValue: true });

    return <Switch label={t("showOnStartup")} checked={value} onChange={(_, { checked }) => updateValue(checked)} />;
};
