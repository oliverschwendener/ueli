import { useExtensionSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { SettingGroup } from "@Core/Settings/SettingGroup";
import { SettingGroupList } from "@Core/Settings/SettingGroupList";
import { Input } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const TodoistSettings = () => {
    const extensionId = "Todoist";
    const { t } = useTranslation("extension[Todoist]");

    const { value: prefix, updateValue: setPrefix } = useExtensionSetting<string>({
        extensionId,
        key: "prefix",
    });

    const { value: suggestionLimit, updateValue: setSuggestionLimit } = useExtensionSetting<number>({
        extensionId,
        key: "suggestionLimit",
    });

    const { value: apiToken, updateValue: setApiToken } = useExtensionSetting<string>({
        extensionId,
        key: "apiToken",
        isSensitive: true,
    });

    return (
        <SettingGroupList>
            <SettingGroup title={t("extensionName") ?? "Todoist"}>
                <Setting
                    label={t("prefix")}
                    control={<Input value={prefix} onChange={(_, { value }) => setPrefix(value)} />}
                />
                <Setting
                    label={t("suggestionLimit")}
                    control={
                        <Input
                            value={`${suggestionLimit}`}
                            min={1}
                            type="number"
                            onChange={(_, { value }) => setSuggestionLimit(Number(value))}
                        />
                    }
                />
                <Setting
                    label={t("apiToken")}
                    control={<Input value={apiToken} type="password" onChange={(_, { value }) => setApiToken(value)} />}
                />
            </SettingGroup>
        </SettingGroupList>
    );
};
