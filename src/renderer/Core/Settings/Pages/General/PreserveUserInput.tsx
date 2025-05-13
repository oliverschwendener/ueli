import { useSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { Switch } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const PreserveUserInput = () => {
    const { t } = useTranslation("settingsGeneral");

    const { value, updateValue } = useSetting({ key: "general.preserveUserInput", defaultValue: true });

    return (
        <Setting
            label={t("preserveUserInput")}
            description={t("preserveUserInputDescription")}
            control={<Switch checked={value} onChange={(_, { checked }) => updateValue(checked)} />}
        />
    );
};
