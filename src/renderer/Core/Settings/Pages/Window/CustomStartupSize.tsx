import { Setting } from "@Core/Settings/Setting";
import { Switch } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

type Props = {
    useCustomSize: boolean;
    setUseCustomSize: (useCustomSize: boolean) => void;
};

export const CustomStartupSize = ({ useCustomSize, setUseCustomSize }: Props) => {
    const { t } = useTranslation("settingsWindow");

    return (
        <Setting
            label={t("customStartupSize")}
            control={
                <Switch size="small" checked={useCustomSize} onChange={(_, { checked }) => setUseCustomSize(checked)} />
            }
        />
    );
};
