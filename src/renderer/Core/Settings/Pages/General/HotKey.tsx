import { useSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { isValidHotkey } from "@common/Core/Hotkey";
import { Button, Field, Input, Tooltip } from "@fluentui/react-components";
import { InfoRegular } from "@fluentui/react-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const HotKey = () => {
    const { t } = useTranslation("settingsGeneral");

    const { value: hotkey, updateValue: setHotkey } = useSetting({ key: "general.hotkey", defaultValue: "Alt+Space" });

    const [temporaryHotkey, setTemporaryHotkey] = useState<string>(hotkey);

    return (
        <Setting
            label={t("hotkey")}
            control={
                <Field
                    validationMessage={isValidHotkey(temporaryHotkey) ? t("validHotkey") : t("invalidHotkey")}
                    validationState={isValidHotkey(temporaryHotkey) ? "success" : "error"}
                >
                    <Input
                        value={temporaryHotkey}
                        onChange={(_, { value }) => setTemporaryHotkey(value)}
                        onBlur={() =>
                            isValidHotkey(temporaryHotkey) ? setHotkey(temporaryHotkey) : setTemporaryHotkey(hotkey)
                        }
                        contentAfter={
                            <Tooltip content={t("hotkeyMoreInfo")} relationship="label" withArrow>
                                <Button
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
