import type { UuidVersion } from "@common/Extensions/UuidGenerator";
import { useExtensionSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { SettingGroup } from "@Core/Settings/SettingGroup";
import { SettingGroupList } from "@Core/Settings/SettingGroupList";
import { Checkbox, Dropdown, Input, Option } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const UuidGeneratorSettings = () => {
    const extensionId = "UuidGenerator";
    const { t } = useTranslation("extension[UuidGenerator]");

    const versionOptions: UuidVersion[] = ["v4", "v6", "v7"];

    const { value: uuidVersion, updateValue: setUuidVersion } = useExtensionSetting<UuidVersion>({
        extensionId,
        key: "uuidVersion",
    });

    const { value: numberOfUuids, updateValue: setNumberOfUuids } = useExtensionSetting<number>({
        extensionId,
        key: "numberOfUuids",
    });

    const { value: uppercase, updateValue: setUppercase } = useExtensionSetting<boolean>({
        extensionId,
        key: "uppercase",
    });

    const { value: hyphens, updateValue: setHyphens } = useExtensionSetting<boolean>({
        extensionId,
        key: "hyphens",
    });

    const { value: braces, updateValue: setBraces } = useExtensionSetting<boolean>({
        extensionId,
        key: "braces",
    });

    const { value: quotes, updateValue: setQuotes } = useExtensionSetting<boolean>({
        extensionId,
        key: "quotes",
    });

    return (
        <SettingGroupList>
            <SettingGroup title={t("extensionName")}>
                <Setting
                    label={t("uuidVersion")}
                    control={
                        <Dropdown
                            value={uuidVersion}
                            selectedOptions={[uuidVersion]}
                            onOptionSelect={(_, { optionValue }) => setUuidVersion(optionValue as UuidVersion)}
                        >
                            {versionOptions.map((versionName) => (
                                <Option key={versionName} value={versionName} text={versionName}>
                                    {versionName}
                                </Option>
                            ))}
                        </Dropdown>
                    }
                />
                <Setting
                    label={t("numberOfUuids")}
                    control={
                        <Input
                            value={`${numberOfUuids}`}
                            type="number"
                            onChange={(_, { value }) => value && setNumberOfUuids(Math.abs(Number(value)))}
                        />
                    }
                />
                <Setting
                    label={t("uppercase")}
                    control={
                        <Checkbox checked={uppercase} onChange={(_, { checked }) => setUppercase(checked === true)} />
                    }
                />
                <Setting
                    label={t("hyphens")}
                    control={<Checkbox checked={hyphens} onChange={(_, { checked }) => setHyphens(checked === true)} />}
                />
                <Setting
                    label={t("braces")}
                    control={<Checkbox checked={braces} onChange={(_, { checked }) => setBraces(checked === true)} />}
                />
                <Setting
                    label={t("quotes")}
                    control={<Checkbox checked={quotes} onChange={(_, { checked }) => setQuotes(checked === true)} />}
                />
            </SettingGroup>
        </SettingGroupList>
    );
};
