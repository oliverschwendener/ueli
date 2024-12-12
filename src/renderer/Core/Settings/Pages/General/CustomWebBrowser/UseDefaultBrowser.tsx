import { Setting } from "@Core/Settings/Setting";
import { Switch } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

type UseDefaultBrowserProps = {
    useDefaultWebBrowser: boolean;
    setUseDefaultBrowser: (value: boolean) => void;
};

export const UseDefaultBrowser = ({ useDefaultWebBrowser, setUseDefaultBrowser }: UseDefaultBrowserProps) => {
    const { t } = useTranslation("settingsGeneral");

    return (
        <Setting
            label={t("useDefaultWebBrowser")}
            control={
                <Switch checked={useDefaultWebBrowser} onChange={(_, { checked }) => setUseDefaultBrowser(checked)} />
            }
        />
    );
};
