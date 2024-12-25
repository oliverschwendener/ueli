import { useSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { Switch } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const WorkspaceVisibility = () => {
    const { t } = useTranslation("settingsWindow");

    const { value, updateValue } = useSetting({
        key: "window.visibleOnAllWorkspaces",
        defaultValue: false,
    });

    return (
        <Setting
            label={t("visibleOnAllWorkspaces")}
            control={<Switch checked={value} onChange={(_, { checked }) => updateValue(checked)} />}
        />
    );
};
