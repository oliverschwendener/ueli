import { useSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { isValidHotkey } from "@common/Core/Hotkey";
import { Button, Field, Input, Label, Tooltip } from "@fluentui/react-components";
import { InfoRegular, WarningRegular } from "@fluentui/react-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";

type HotkeyBindingProps = {
    hotkeyEnabled: boolean;
};

export const HotKeyBinding = ({ hotkeyEnabled }: HotkeyBindingProps) => {
    const { t } = useTranslation("settingsGeneral");

    const { value: hotkey, updateValue: setHotkey } = useSetting({ key: "general.hotkey", defaultValue: "Alt+Space" });

    const [temporaryHotkey, setTemporaryHotkey] = useState<string>(hotkey);

    return (
        <Setting
            label={t("hotkeyBinding")}
            control={
                <Field
                    label={
                        window.ContextBridge.getEnvironmentVariable("XDG_SESSION_TYPE") === "wayland" ? (
                            <>
                                <Label weight="semibold">{t("waylandWarning")}</Label>
                                <Tooltip
                                    content={t("waylandWarningMoreInfo")}
                                    relationship="label"
                                    withArrow
                                >
                                    <Button
                                        appearance="subtle"
                                        size="small"
                                        icon={<WarningRegular />}
                                        onClick={() =>
                                            window.ContextBridge.openExternal(
                                                "https://github.com/oliverschwendener/ueli/wiki#linux",
                                            )
                                        }
                                    />
                                </Tooltip>
                            </>
                        ) : undefined
                    }
                    validationMessage={
                        isValidHotkey(temporaryHotkey) ? t("validHotkeyBinding") : t("invalidHotkeyBinding")
                    }
                    validationState={isValidHotkey(temporaryHotkey) ? "success" : "error"}
                >
                    <Input
                        disabled={!hotkeyEnabled}
                        value={temporaryHotkey}
                        onChange={(_, { value }) => setTemporaryHotkey(value)}
                        onBlur={() =>
                            isValidHotkey(temporaryHotkey) ? setHotkey(temporaryHotkey) : setTemporaryHotkey(hotkey)
                        }
                        contentAfter={
                            <Tooltip content={t("hotkeyBindingMoreInfo")} relationship="label" withArrow>
                                <Button
                                    disabled={!hotkeyEnabled}
                                    appearance="subtle"
                                    size="small"
                                    icon={<InfoRegular />}
                                    onClick={() =>
                                        window.ContextBridge.openExternal(
                                            "https://www.electronjs.org/docs/latest/api/accelerator",
                                        )
                                    }
                                />
                            </Tooltip>
                        }
                    />
                </Field>
            }
        />
    );
};
