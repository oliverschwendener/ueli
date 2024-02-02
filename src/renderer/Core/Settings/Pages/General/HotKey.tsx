import { useContextBridge, useSetting } from "@Core/Hooks";
import { isValidHotkey } from "@common/Core/Hotkey";
import {
    Button,
    Field,
    Input,
    Toast,
    ToastTitle,
    Toaster,
    Tooltip,
    useId,
    useToastController,
} from "@fluentui/react-components";
import { InfoRegular, SaveRegular } from "@fluentui/react-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const HotKey = () => {
    const { t } = useTranslation();
    const ns = "settingsGeneral";

    const hotkeyToasterId = useId("hotkeyToasterId");

    const { contextBridge } = useContextBridge();
    const { dispatchToast } = useToastController(hotkeyToasterId);

    const { value: hotkey, updateValue: setHotkey } = useSetting("general.hotkey", "Alt+Space");

    const [temporaryHotkey, setTemporaryHotkey] = useState<string>(hotkey);
    const [isValidTemporaryHotkey, setIsValidTemporaryHotkey] = useState<boolean>(true);

    const validateTemporaryHotkey = (possibleHotkey: string) =>
        setIsValidTemporaryHotkey(isValidHotkey(possibleHotkey));

    const saveHotkey = () => {
        setHotkey(temporaryHotkey);

        dispatchToast(
            <Toast>
                <ToastTitle>New hotkey saved: {temporaryHotkey}</ToastTitle>
            </Toast>,
            { intent: "success" },
        );
    };

    return (
        <Field
            label={t("hotkey", { ns })}
            validationMessage={isValidTemporaryHotkey ? t("validHotkey", { ns }) : t("invalidHotkey", { ns })}
            validationState={isValidTemporaryHotkey ? "success" : "error"}
        >
            <Toaster toasterId={hotkeyToasterId} />
            <Input
                value={temporaryHotkey}
                onChange={(_, { value }) => {
                    setTemporaryHotkey(value);
                    validateTemporaryHotkey(value);
                }}
                contentAfter={
                    <>
                        <Tooltip content={t("saveHotkey", { ns })} relationship="label">
                            <Button
                                appearance="subtle"
                                size="small"
                                icon={<SaveRegular />}
                                disabled={!isValidTemporaryHotkey}
                                onClick={() => saveHotkey()}
                            />
                        </Tooltip>
                        <Tooltip content={t("hotkeyMoreInfo", { ns })} relationship="label">
                            <Button
                                appearance="subtle"
                                size="small"
                                icon={<InfoRegular />}
                                onClick={() =>
                                    contextBridge.openExternal("https://www.electronjs.org/docs/latest/api/accelerator")
                                }
                            />
                        </Tooltip>
                    </>
                }
            />
        </Field>
    );
};
