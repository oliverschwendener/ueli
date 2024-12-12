import { Button, MessageBar, MessageBarActions, MessageBarBody, Tooltip } from "@fluentui/react-components";
import { InfoRegular } from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";

export const WaylandWarning = () => {
    const { t } = useTranslation("settingsGeneral");

    return (
        <MessageBar intent="warning">
            <MessageBarBody>{t("waylandWarning")}</MessageBarBody>
            <MessageBarActions>
                <Tooltip content={t("waylandWarningMoreInfo")} relationship="label" withArrow>
                    <Button
                        appearance="subtle"
                        size="small"
                        icon={<InfoRegular />}
                        onClick={() =>
                            window.ContextBridge.openExternal("https://github.com/oliverschwendener/ueli/wiki#linux")
                        }
                    />
                </Tooltip>
            </MessageBarActions>
        </MessageBar>
    );
};
