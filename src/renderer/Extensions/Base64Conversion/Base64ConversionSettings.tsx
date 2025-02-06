import { useExtensionSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { SettingGroup } from "@Core/Settings/SettingGroup";
import { SettingGroupList } from "@Core/Settings/SettingGroupList";
import { Input } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const Base64ConversionSettings = () => {
    const extensionId = "Base64Conversion";
    const { t } = useTranslation("extension[Base64Conversion]");

    const { value: encodeDecodePrefix, updateValue: setEncodeDecodePrefix } = useExtensionSetting<string>({
        extensionId,
        key: "encodeDecodePrefix",
    });

    const { value: encodePrefix, updateValue: setEncodePrefix } = useExtensionSetting<string>({
        extensionId,
        key: "encodePrefix",
    });

    const { value: decodePrefix, updateValue: setDecodePrefix } = useExtensionSetting<string>({
        extensionId,
        key: "decodePrefix",
    });

    return (
        <SettingGroupList>
            <SettingGroup title={t("extensionName")}>
                <Setting
                    label={t("encodeDecodePrefix")}
                    control={
                        <Input
                            value={`${encodeDecodePrefix}`}
                            type="text"
                            onChange={(_, { value }) => value && setEncodeDecodePrefix(value)}
                        />
                    }
                />
                <Setting
                    label={t("encodePrefix")}
                    control={
                        <Input
                            value={`${encodePrefix}`}
                            type="text"
                            onChange={(_, { value }) => value && setEncodePrefix(value)}
                        />
                    }
                />
                <Setting
                    label={t("decodePrefix")}
                    control={
                        <Input
                            value={`${decodePrefix}`}
                            type="text"
                            onChange={(_, { value }) => value && setDecodePrefix(value)}
                        />
                    }
                />
            </SettingGroup>
        </SettingGroupList>
    );
};
