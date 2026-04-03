import { useExtensionSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { SettingGroup } from "@Core/Settings/SettingGroup";
import { SettingGroupList } from "@Core/Settings/SettingGroupList";
import { Input, Switch } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const QuickFormatterSettings = () => {
    const extensionId = "QuickFormatter";
    const { t } = useTranslation("extension[QuickFormatter]");

    const { value: command, updateValue: setCommand } = useExtensionSetting<string>({
        extensionId,
        key: "command",
    });

    const { value: enableStackTrace, updateValue: setEnableStackTrace } = useExtensionSetting<boolean>({
        extensionId,
        key: "enableStackTrace",
    });

    const { value: enableJson, updateValue: setEnableJson } = useExtensionSetting<boolean>({
        extensionId,
        key: "enableJson",
    });

    const { value: enableXml, updateValue: setEnableXml } = useExtensionSetting<boolean>({
        extensionId,
        key: "enableXml",
    });
    const { value: enableDeepFormatting, updateValue: setEnableDeepFormatting } = useExtensionSetting<boolean>({
        extensionId,
        key: "enableDeepFormatting",
    });

    return (
        <SettingGroupList>
            <SettingGroup title={t("extensionName")}>
                <Setting
                    label={t("command")}
                    control={
                        <Input
                            value={`${command}`}
                            type="text"
                            onChange={(_, { value }) => value && setCommand(value)}
                        />
                    }
                />
                <Setting
                    label={t("enableStackTrace")}
                    control={
                        <Switch
                            checked={enableStackTrace}
                            onChange={(_, { checked }) => setEnableStackTrace(checked)}
                        />
                    }
                />
                <Setting
                    label={t("enableJson")}
                    control={<Switch checked={enableJson} onChange={(_, { checked }) => setEnableJson(checked)} />}
                />
                <Setting
                    label={t("enableXml")}
                    control={<Switch checked={enableXml} onChange={(_, { checked }) => setEnableXml(checked)} />}
                />
                <Setting
                    label={t("enableDeepFormatting")}
                    control={
                        <Switch
                            checked={enableDeepFormatting}
                            onChange={(_, { checked }) => setEnableDeepFormatting(checked)}
                        />
                    }
                />
            </SettingGroup>
        </SettingGroupList>
    );
};
