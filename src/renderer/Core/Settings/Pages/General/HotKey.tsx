import { useContextBridge, useSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { isValidHotkey } from "@common/Core/Hotkey";
import { Button, Field, Input, Label, Tooltip } from "@fluentui/react-components";
import { InfoRegular, WarningRegular } from "@fluentui/react-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const HotKey = () => {
    const { t } = useTranslation();
    const ns = "settingsGeneral";

    const { contextBridge } = useContextBridge();

    const { value: hotkey, updateValue: setHotkey } = useSetting({ key: "general.hotkey", defaultValue: "Alt+Space" });

    const [temporaryHotkey, setTemporaryHotkey] = useState<string>(hotkey);

    return (
        <Setting
            label={t("hotkey", { ns })}
            control={
                <Field
                    label={
                        contextBridge.getEnvironmentVariable("XDG_SESSION_TYPE") === "wayland" ? (
                            <>
                                <Label weight="semibold">{t("waylandWarning", { ns })}</Label>
                                <Tooltip content={t("waylandWarningMoreInfo", { ns })} relationship="label" withArrow>
                                    <Button
                                        appearance="subtle"
                                        size="small"
                                        icon={<WarningRegular />}
                                        onClick={() => contextBridge.openExternal("https://www.example.com")}
                                    />
                                </Tooltip>
                            </>
                        ) : undefined
                    }
                    validationMessage={
                        isValidHotkey(temporaryHotkey) ? t("validHotkey", { ns }) : t("invalidHotkey", { ns })
                    }
                    validationState={isValidHotkey(temporaryHotkey) ? "success" : "error"}
                >
                    <Input
                        value={temporaryHotkey}
                        onChange={(_, { value }) => setTemporaryHotkey(value)}
                        onBlur={() =>
                            isValidHotkey(temporaryHotkey) ? setHotkey(temporaryHotkey) : setTemporaryHotkey(hotkey)
                        }
                        contentAfter={
                            <Tooltip content={t("hotkeyMoreInfo", { ns })} relationship="label" withArrow>
                                <Button
                                    appearance="subtle"
                                    size="small"
                                    icon={<InfoRegular />}
                                    onClick={() =>
                                        contextBridge.openExternal(
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
