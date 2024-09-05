import { useExtensionSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { SettingGroup } from "@Core/Settings/SettingGroup";
import { SettingGroupList } from "@Core/Settings/SettingGroupList";
import { Input } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const VSCodeSettings = () => {
    const extensionId = "VSCode";

    const { t } = useTranslation("extension[VSCode]");

    const { value: prefix, updateValue: setPrefix } = useExtensionSetting<string>({
        extensionId,
        key: "prefix",
    });

    return (
        <SettingGroupList>
            <SettingGroup title={t("extensionName")}>
                <Setting
                    label={t("prefix")}
                    control={<Input value={prefix} onChange={(_, { value }) => setPrefix(value)} />}
                />
            </SettingGroup>
        </SettingGroupList>
    );
};
