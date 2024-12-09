import { useSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { Input } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

type CustomWebBrowserArgumentListProps = {
    useDefaultWebBrowser: boolean;
};

export const CustomWebBrowserCommandlineArguments = ({ useDefaultWebBrowser }: CustomWebBrowserArgumentListProps) => {
    const { t } = useTranslation("settingsGeneral");

    const { value: argumentList, updateValue: setArgumentList } = useSetting<string>({
        key: "general.browser.customWebBrowser.commandlineArguments",
        defaultValue: "{{url}}",
    });

    return (
        <Setting
            label={t("customWebBrowserCommandlineArguments")}
            control={
                <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                    <Input
                        disabled={useDefaultWebBrowser}
                        value={argumentList}
                        onChange={(_, { value }) => setArgumentList(value)}
                        placeholder="-private-window {{url}}"
                    />
                </div>
            }
        />
    );
};
