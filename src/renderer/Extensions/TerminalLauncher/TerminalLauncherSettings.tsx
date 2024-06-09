import { useContextBridge, useExtensionSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { SettingGroup } from "@Core/Settings/SettingGroup";
import { SettingGroupList } from "@Core/Settings/SettingGroupList";
import { Dropdown, Input, Option } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const TerminalLauncherSettings = () => {
    const { contextBridge } = useContextBridge();
    const { t } = useTranslation("extension[TerminalLauncher]");

    const extensionId = "TerminalLauncher";

    const { value: prefix, updateValue: setPrefix } = useExtensionSetting<string>({ extensionId, key: "prefix" });

    const { value: terminalIds, updateValue: setTerminalIds } = useExtensionSetting<string[]>({
        extensionId,
        key: "terminalIds",
    });

    const availableTerminals = contextBridge.getAvailableTerminals();

    return (
        <SettingGroupList>
            <SettingGroup title={t("extensionName")}>
                <Setting
                    label={t("prefix")}
                    description={t("prefixDescription")}
                    control={<Input value={prefix} onChange={(_, { value }) => setPrefix(value)} />}
                />
                <Setting
                    label={t("terminals")}
                    control={
                        <Dropdown
                            selectedOptions={terminalIds}
                            value={terminalIds.join(", ")}
                            placeholder={t("selectTerminals")}
                            multiselect
                            onOptionSelect={(_, { selectedOptions }) => setTerminalIds(selectedOptions)}
                        >
                            {availableTerminals.map((terminal) => (
                                <Option key={terminal.id} value={terminal.id} text={terminal.name}>
                                    <img src={`file://${terminal.assetFilePath}`} width={24} alt={terminal.name} />
                                    <span>{terminal.name}</span>
                                </Option>
                            ))}
                        </Dropdown>
                    }
                />
            </SettingGroup>
        </SettingGroupList>
    );
};
