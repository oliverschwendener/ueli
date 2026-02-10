import { useExtensionSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { SettingGroup } from "@Core/Settings/SettingGroup";
import { SettingGroupList } from "@Core/Settings/SettingGroupList";
import { Input } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const RowlandTextEditorSettings = () => {
    const extensionId = "RowlandTextEditor";
    const { t } = useTranslation("extension[RowlandTextEditor]");

    const { value: rowSeparator, updateValue: setRowSeparator } = useExtensionSetting<string>({
        extensionId,
        key: "rowSeparator",
    });

    const { value: columnSeparator, updateValue: setColumnSeparator } = useExtensionSetting<string>({
        extensionId,
        key: "columnSeparator",
    });

    return (
        <SettingGroupList>
            <SettingGroup title={t("extensionName")}>
                <Setting
                    label={t("columnSeparator")}
                    control={
                        <Input
                            value={`${rowSeparator}`}
                            type="text"
                            onChange={(_, { value }) => value && setRowSeparator(value)}
                        />
                    }
                />
                <Setting
                    label={t("rowSeparator")}
                    control={
                        <Input
                            value={`${columnSeparator}`}
                            type="text"
                            onChange={(_, { value }) => value && setColumnSeparator(value)}
                        />
                    }
                />
            </SettingGroup>
        </SettingGroupList>
    );
};
