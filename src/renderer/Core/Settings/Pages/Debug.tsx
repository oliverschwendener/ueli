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
    const { contextBridge } = useContextBridge();
    const { theme } = useTheme(contextBridge);

    return (
        <SectionList>
            <Section>
                <Field label={t("settingsPage.debug.resetAllSettings")}>
                    <Dialog>
                        <DialogTrigger disableButtonEnhancement>
                            <div>
                                <Button>{t("settingsPage.debug.resetAllSettings.button")}</Button>
                            </div>
                        </DialogTrigger>
                        <DialogSurface>
                            <DialogBody>
                                <DialogTitle>{t("settingsPage.debug.resetAllSettings.dialogTitle")}</DialogTitle>
                                <DialogContent>{t("settingsPage.debug.resetAllSettings.dialogContent")}</DialogContent>
                                <DialogActions>
                                    <DialogTrigger disableButtonEnhancement>
                                        <Button appearance="secondary">
                                            {t("settingsPage.debug.resetAllSettings.cancel")}
                                        </Button>
                                    </DialogTrigger>
                                    <Button onClick={() => contextBridge.resetAllSettings()} appearance="primary">
                                        {t("settingsPage.debug.resetAllSettings.confirm")}
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
                            background: "transparent",
                            color: theme.colorNeutralForeground1,
                        }}
                    />
                </Field>
            </Section>
        </SectionList>
    );
};
