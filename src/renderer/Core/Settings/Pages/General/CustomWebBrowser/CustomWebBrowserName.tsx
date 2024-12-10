import { useSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { Input } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

type CustomWebBrowserNameProps = {
    useDefaultWebBrowser: boolean;
};

export const CustomWebBrowserName = ({ useDefaultWebBrowser }: CustomWebBrowserNameProps) => {
    const { t } = useTranslation("settingsGeneral");

    const { value, updateValue } = useSetting({ key: "general.browser.customWebBrowserName", defaultValue: "" });

    return (
        <Setting
            label={t("customWebBrowserName")}
            control={
                <Input
                    placeholder="Google Chrome, Firefox, Brave"
                    value={value}
                    onChange={(_, { value }) => updateValue(value)}
                    disabled={useDefaultWebBrowser}
                />
            }
        />
    );
};
