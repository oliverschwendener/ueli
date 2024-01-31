import { isValidHotkey } from "@common/Core/Hotkey";
import {
    Button,
    Dropdown,
    Field,
    Input,
    Option,
    Toast,
    ToastTitle,
    Toaster,
    Tooltip,
    useId,
    useToastController,
} from "@fluentui/react-components";
import { InfoRegular, SaveRegular } from "@fluentui/react-icons";
import { changeLanguage } from "i18next";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useContextBridge, useSetting } from "../../Hooks";
import { supportedLanguages } from "../../I18n";
import { Section } from "../Section";
import { SectionList } from "../SectionList";

export const General = () => {
    const { contextBridge } = useContextBridge();
    const { t } = useTranslation();
    const hotkeyToasterId = useId("hotkeyToaster");
    const { dispatchToast } = useToastController(hotkeyToasterId);

    const { value: language, updateValue: setLanguage } = useSetting(
        "general.language",
        "en-US",
        false,
        (updatedLanguage) => changeLanguage(updatedLanguage),
    );

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
        <SectionList>
            <Section>
                <Field label={t("settingsGeneral.language")}>
                    <Dropdown
                        value={supportedLanguages.find(({ locale }) => locale === language)?.name}
                        selectedOptions={[language]}
                        onOptionSelect={(_, { optionValue }) => optionValue && setLanguage(optionValue)}
                    >
                        {supportedLanguages.map(({ name, locale }) => (
                            <Option key={locale} value={locale} text={name}>
                                {name}
                            </Option>
                        ))}
                    </Dropdown>
                </Field>
            </Section>
            <Section>
                <Field
                    label={t("general.hotkey")}
                    validationMessage={isValidTemporaryHotkey ? t("general.hotkey.valid") : t("general.hotkey.invalid")}
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
                                <Tooltip content={t("general.hotkey.save")} relationship="label">
                                    <Button
                                        appearance="subtle"
                                        size="small"
                                        icon={<SaveRegular />}
                                        disabled={!isValidTemporaryHotkey}
                                        onClick={() => saveHotkey()}
                                    />
                                </Tooltip>
                                <Tooltip content={t("general.hotkey.moreInfo")} relationship="label">
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
                            </>
                        }
                    />
                </Field>
            </Section>
        </SectionList>
    );
};
