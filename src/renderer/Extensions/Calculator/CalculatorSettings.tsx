import { useExtensionSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { SettingGroup } from "@Core/Settings/SettingGroup";
import { SettingGroupList } from "@Core/Settings/SettingGroupList";
import { Input, SpinButton } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const CalculatorSettings = () => {
    const extensionId = "Calculator";

    const { t } = useTranslation("extension[Calculator]");

    const { value: precision, updateValue: setPrecision } = useExtensionSetting<number>({
        extensionId,
        key: "precision",
    });

    const { value: decimalSeparator, updateValue: setDecimalSeparator } = useExtensionSetting<string>({
        extensionId,
        key: "decimalSeparator",
    });

    const { value: argumentSeparator, updateValue: setArgumentSeparator } = useExtensionSetting<string>({
        extensionId,
        key: "argumentSeparator",
    });

    return (
        <SettingGroupList>
            <SettingGroup title={t("extensionName")}>
                <Setting
                    label={t("precision")}
                    control={
                        <SpinButton
                            value={precision}
                            onChange={(_, { value }) => value && setPrecision(value)}
                            min={1}
                            max={32}
                            step={1}
                        />
                    }
                />
                <Setting
                    label={t("decimalSeparator")}
                    control={<Input value={decimalSeparator} onChange={(_, { value }) => setDecimalSeparator(value)} />}
                />
                <Setting
                    label={t("argumentSeparator")}
                    control={
                        <Input value={argumentSeparator} onChange={(_, { value }) => setArgumentSeparator(value)} />
                    }
                />
            </SettingGroup>
        </SettingGroupList>
    );
};
