import { useExtensionSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { SettingGroup } from "@Core/Settings/SettingGroup";
import { SettingGroupList } from "@Core/Settings/SettingGroupList";
import { Input, Tooltip } from "@fluentui/react-components";
import { Info16Regular } from "@fluentui/react-icons";
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

    return (
        <SettingGroupList>
            <SettingGroup title={t("extensionName")}>
                <Setting
                    label={t("prefix")}
                    control={<Input value={prefix} onChange={(_, { value }) => setPrefix(value)} />}
                />
                <Setting
                    label={t("command")}
                    control={
                        <>
                            <Tooltip relationship="description" content={t("commandTooltip")}>
                                <Info16Regular style={{ marginRight: 20 }} />
                            </Tooltip>
                            <Input value={command} onChange={(_, { value }) => setCommand(value)} />
                        </>
                    }
                />
            </SettingGroup>
        </SettingGroupList>
    );
};
