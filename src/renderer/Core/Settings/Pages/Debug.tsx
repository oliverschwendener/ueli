import {
    Button,
    Dialog,
    DialogActions,
    DialogBody,
    DialogContent,
    DialogSurface,
    DialogTitle,
    DialogTrigger,
    Field,
} from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { useContextBridge, useTheme } from "../../Hooks";
import { Section } from "../Section";
import { SectionList } from "../SectionList";

export const Debug = () => {
    const { t } = useTranslation();
    const ns = "settingsDebug";
    const { contextBridge } = useContextBridge();
    const { theme } = useTheme();

    return (
        <SectionList>
            <Section>
                <Field label={t("resetAllSettings", { ns })}>
                    <Dialog>
                        <DialogTrigger disableButtonEnhancement>
                            <div>
                                <Button>{t("resetAllSettingsButton", { ns })}</Button>
                            </div>
                        </DialogTrigger>
                        <DialogSurface>
                            <DialogBody>
                                <DialogTitle>{t("resetAllSettingsDialogTitle", { ns })}</DialogTitle>
                                <DialogContent>{t("resetAllSettingsDialogContent", { ns })}</DialogContent>
                                <DialogActions>
                                    <DialogTrigger disableButtonEnhancement>
                                        <Button appearance="secondary">{t("resetAllSettingsCancel", { ns })}</Button>
                                    </DialogTrigger>
                                    <Button onClick={() => contextBridge.resetAllSettings()} appearance="primary">
                                        {t("resetAllSettingsConfirm", { ns })}
                                    </Button>
                                </DialogActions>
                            </DialogBody>
                        </DialogSurface>
                    </Dialog>
                </Field>
            </Section>
            <Section>
                <Field label="Logs">
                    <textarea
                        id="logs"
                        readOnly
                        value={contextBridge.getLogs().join("\n\n")}
                        style={{
                            height: 150,
                            width: "100%",
                            fontFamily: theme.fontFamilyMonospace,
                            fontSize: theme.fontSizeBase200,
                            resize: "vertical",
                            background: theme.colorNeutralBackground1,
                            color: theme.colorNeutralForeground1,
                            borderRadius: theme.borderRadiusMedium,
                            padding: 10,
                            boxSizing: "border-box",
                        }}
                    />
                </Field>
            </Section>
        </SectionList>
    );
};
