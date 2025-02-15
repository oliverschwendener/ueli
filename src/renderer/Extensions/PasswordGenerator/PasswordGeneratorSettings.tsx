import { PasswordGeneratorDefaultSymbols } from "@common/Extensions/PasswordGenerator";
import { useExtensionSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { SettingGroup } from "@Core/Settings/SettingGroup";
import { SettingGroupList } from "@Core/Settings/SettingGroupList";
import { Button, Input, Switch, Tooltip } from "@fluentui/react-components";
import { ArrowCounterclockwiseRegular } from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";

export const PasswordGeneratorSettings = () => {
    const extensionId = "PasswordGenerator";
    const { t } = useTranslation("extension[PasswordGenerator]");

    const { value: command, updateValue: setCommand } = useExtensionSetting<string>({
        extensionId,
        key: "command",
    });

    const { value: quantity, updateValue: setQuantity } = useExtensionSetting<number>({
        extensionId,
        key: "quantity",
    });

    const { value: passwordLength, updateValue: setPasswordLength } = useExtensionSetting<number>({
        extensionId,
        key: "passwordLength",
    });

    const { value: includeUppercaseCharacters, updateValue: setIncludeUppercaseCharacters } =
        useExtensionSetting<boolean>({
            extensionId,
            key: "includeUppercaseCharacters",
        });

    const { value: includeLowercaseCharacters, updateValue: setIncludeLowercaseCharacters } =
        useExtensionSetting<boolean>({
            extensionId,
            key: "includeLowercaseCharacters",
        });

    const { value: includeNumbers, updateValue: setIncludeNumbers } = useExtensionSetting<boolean>({
        extensionId,
        key: "includeNumbers",
    });

    const { value: includeSymbols, updateValue: setIncludeSymbols } = useExtensionSetting<boolean>({
        extensionId,
        key: "includeSymbols",
    });

    const { value: symbols, updateValue: setSymbols } = useExtensionSetting<string>({
        extensionId,
        key: "symbols",
    });

    const { value: beginWithALetter, updateValue: setBeginWithALetter } = useExtensionSetting<boolean>({
        extensionId,
        key: "beginWithALetter",
    });

    const { value: noSimilarCharacters, updateValue: setNoSimilarCharacters } = useExtensionSetting<boolean>({
        extensionId,
        key: "noSimilarCharacters",
    });

    const { value: noDuplicateCharacters, updateValue: setNoDuplicateCharacters } = useExtensionSetting<boolean>({
        extensionId,
        key: "noDuplicateCharacters",
    });

    const { value: noSequentialCharacters, updateValue: setNoSequentialCharacters } = useExtensionSetting<boolean>({
        extensionId,
        key: "noSequentialCharacters",
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
                    label={t("quantity")}
                    control={
                        <Input
                            value={`${quantity}`}
                            type="number"
                            onChange={(_, { value }) => value && setQuantity(Math.abs(Number(value)))}
                        />
                    }
                />
                <Setting
                    label={t("passwordLength")}
                    control={
                        <Input
                            value={`${passwordLength}`}
                            type="number"
                            onChange={(_, { value }) => value && setPasswordLength(Math.abs(Number(value)))}
                        />
                    }
                />
                <Setting
                    label={t("includeUppercaseCharacters")}
                    control={
                        <Switch
                            checked={includeUppercaseCharacters}
                            onChange={(_, { checked }) => setIncludeUppercaseCharacters(checked)}
                        />
                    }
                />
                <Setting
                    label={t("includeLowercaseCharacters")}
                    control={
                        <Switch
                            checked={includeLowercaseCharacters}
                            onChange={(_, { checked }) => setIncludeLowercaseCharacters(checked)}
                        />
                    }
                />
                <Setting
                    label={t("includeNumbers")}
                    control={
                        <Switch checked={includeNumbers} onChange={(_, { checked }) => setIncludeNumbers(checked)} />
                    }
                />
                <Setting
                    label={t("includeSymbols")}
                    control={
                        <div
                            style={{
                                flexGrow: 1,
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "flex-end",
                                alignItems: "center",
                            }}
                        >
                            <Input
                                style={{ width: 300 }}
                                value={`${symbols}`}
                                type="text"
                                onChange={(_, { value }) => value && setSymbols(value)}
                                contentAfter={
                                    <Tooltip content={t("resetSymbols")} relationship="label" withArrow>
                                        <Button
                                            size="small"
                                            appearance="subtle"
                                            icon={<ArrowCounterclockwiseRegular fontSize={14} />}
                                            onClick={() => setSymbols(PasswordGeneratorDefaultSymbols)}
                                        />
                                    </Tooltip>
                                }
                            />
                            <Switch
                                checked={includeSymbols}
                                onChange={(_, { checked }) => setIncludeSymbols(checked)}
                            />
                        </div>
                    }
                />
                <Setting
                    label={t("beginWithALetter")}
                    control={
                        <Switch
                            checked={beginWithALetter}
                            onChange={(_, { checked }) => setBeginWithALetter(checked)}
                        />
                    }
                />
                <Setting
                    label={t("noSimilarCharacters")}
                    control={
                        <Switch
                            checked={noSimilarCharacters}
                            onChange={(_, { checked }) => setNoSimilarCharacters(checked)}
                        />
                    }
                />
                <Setting
                    label={t("noDuplicateCharacters")}
                    control={
                        <Switch
                            checked={noDuplicateCharacters}
                            onChange={(_, { checked }) => setNoDuplicateCharacters(checked)}
                        />
                    }
                />
                <Setting
                    label={t("noSequentialCharacters")}
                    control={
                        <Switch
                            checked={noSequentialCharacters}
                            onChange={(_, { checked }) => setNoSequentialCharacters(checked)}
                        />
                    }
                />
            </SettingGroup>
        </SettingGroupList>
    );
};
