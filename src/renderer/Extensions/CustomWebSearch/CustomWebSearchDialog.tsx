import type { CustomSearchEngineSetting } from "@common/Extensions/CustomWebSearch";
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogBody,
    DialogContent,
    DialogSurface,
    DialogTitle,
    DialogTrigger,
    Field,
    InfoLabel,
    Input,
} from "@fluentui/react-components";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type CustomWebSearchDialogProps = {
    onSave: (engineSettings: CustomSearchEngineSetting) => void;
    initialEngineSetting: CustomSearchEngineSetting;
    isDialogOpen: boolean;
    closeDialog: () => void;
};

const validateCustomSearchEngineSetting = (
    engineSetting: CustomSearchEngineSetting,
): Partial<Record<keyof CustomSearchEngineSetting, string>> => {
    const validation: Partial<Record<keyof CustomSearchEngineSetting, string>> = {};

    if (!engineSetting.name) {
        validation.name = "nameError";
    }

    if (!engineSetting.prefix) {
        validation.prefix = "prefixError";
    }

    if (!engineSetting.url || !engineSetting.url.includes("{{query}}")) {
        validation.url = "searchEngineUrlError";
    }

    return validation;
};

export const CustomWebSearchDialog = ({ initialEngineSetting, onSave, isDialogOpen, closeDialog }: CustomWebSearchDialogProps) => {
    const { t } = useTranslation("extension[CustomWebSearch]");

    const [temporaryCustomSearchEngineSetting, setTemporaryCustomSearchEngineSetting] =
        useState<CustomSearchEngineSetting>(initialEngineSetting);
    const [validation, setValidation] = useState<Partial<Record<keyof CustomSearchEngineSetting, string>>>({});

    useEffect(() => {
        setTemporaryCustomSearchEngineSetting(initialEngineSetting);
        setValidation(validateCustomSearchEngineSetting(initialEngineSetting));
    }, [initialEngineSetting]);

    const setUrl = (url: string) => {
        const newEngineSetting = { ...temporaryCustomSearchEngineSetting, url };
        setTemporaryCustomSearchEngineSetting(newEngineSetting);
        setValidation(validateCustomSearchEngineSetting(newEngineSetting));
    };
    const setName = (name: string) => {
        const newEngineSetting = { ...temporaryCustomSearchEngineSetting, name };
        setTemporaryCustomSearchEngineSetting(newEngineSetting);
        setValidation(validateCustomSearchEngineSetting(newEngineSetting));
    };
    const setPrefix = (prefix: string) => {
        const newEngineSetting = { ...temporaryCustomSearchEngineSetting, prefix };
        setTemporaryCustomSearchEngineSetting(newEngineSetting);
        setValidation(validateCustomSearchEngineSetting(newEngineSetting));
    };
    const setEncodeSearchTerm = (encodeSearchTerm: boolean) =>
        setTemporaryCustomSearchEngineSetting({ ...temporaryCustomSearchEngineSetting, encodeSearchTerm });

    return (
        <Dialog open={isDialogOpen}        >
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>{t("addSearchEngine")}</DialogTitle>
                    <DialogContent>
                        <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: 10 }}>
                            <Field
                                orientation="horizontal"
                                required={true}
                                label={t("name")}
                                validationMessage={validation.name ? t(validation.name) : ""}
                                validationState={"name" in validation ? "error" : undefined}
                            >
                                <Input
                                    value={temporaryCustomSearchEngineSetting.name}
                                    onChange={(_, { value }) => setName(value)}
                                />
                            </Field>
                            <Field
                                orientation="horizontal"
                                required={true}
                                validationMessage={validation.prefix ? t(validation.prefix) : ""}
                                validationState={"prefix" in validation ? "error" : undefined}
                                label={<InfoLabel info={t("prefixTooltip")}>{t("prefix")}</InfoLabel>}
                            >
                                <Input
                                    value={temporaryCustomSearchEngineSetting.prefix}
                                    onChange={(_, { value }) => setPrefix(value)}
                                />
                            </Field>
                            <Field
                                orientation="horizontal"
                                required={true}
                                validationMessage={validation.url ? t(validation.url) : ""}
                                validationState={"url" in validation ? "error" : undefined}
                                label={<InfoLabel info={t("searchEngineUrlTooltip")}>{t("searchEngineUrl")}</InfoLabel>}
                            >
                                <Input
                                    value={temporaryCustomSearchEngineSetting.url}
                                    onChange={(_, { value }) => setUrl(value)}
                                />
                            </Field>

                            <Field
                                orientation="horizontal"
                                required={true}
                                label={
                                    <InfoLabel info={t("encodeSearchTermTooltip")}>{t("encodeSearchTerm")}</InfoLabel>
                                }
                            >
                                <Checkbox
                                    checked={temporaryCustomSearchEngineSetting.encodeSearchTerm}
                                    onChange={(_, { checked }) => setEncodeSearchTerm(checked === true)}
                                />
                            </Field>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <DialogTrigger disableButtonEnhancement>
                            <Button appearance="secondary" onClick={closeDialog}>
                                {t("cancel")}
                            </Button>
                        </DialogTrigger>
                        <Button
                            disabled={Object.keys(validation).length > 0}
                            onClick={() => {
                                const validationResult = validateCustomSearchEngineSetting(
                                    temporaryCustomSearchEngineSetting,
                                );
                                setValidation(validationResult);
                                if (Object.keys(validationResult).length > 0) {
                                    return;
                                }
                                closeDialog();
                                onSave(temporaryCustomSearchEngineSetting);
                            }}
                            appearance="primary"
                        >
                            {t("save")}
                        </Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};
