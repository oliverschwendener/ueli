import { useExtensionSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { SettingGroup } from "@Core/Settings/SettingGroup";
import { SettingGroupList } from "@Core/Settings/SettingGroupList";
import { Input, Switch } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const VSCodeSettings = () => {
    const extensionId = "VSCode";

    const { t } = useTranslation("extension[VSCode]");

    const { value: prefix, updateValue: setPrefix } = useExtensionSetting<string>({
        extensionId,
        key: "prefix",
    });

    const { value: command, updateValue: setCommand } = useExtensionSetting<string>({
        extensionId,
        key: "command",
    });

    const { value: showPath, updateValue: setShowPath } = useExtensionSetting<boolean>({
        extensionId,
        key: "showPath",
    });

    return (
        <SettingGroupList>
            <SettingGroup title={t("extensionName")}>
                <Setting
                    label={t("prefix")}
                    control={<Input value={prefix} onChange={(_, { value }) => setPrefix(value)} />}
                />
                <Setting
                    label={t("command")}
                    description={t("commandTooltip")}
                    control={<Input value={command} onChange={(_, { value }) => setCommand(value)} />}
                />
                <Setting
                    label={t("showPath")}
                    control={
                        <Switch size="small" checked={showPath} onChange={(_, { checked }) => setShowPath(checked)} />
                    }
                />
            </SettingGroup>
        </SettingGroupList>
    );
};
