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
    Input,
} from "@fluentui/react-components";
import { AddRegular } from "@fluentui/react-icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type EditCustomSearchEngineProps = {
    onSave: (engineSettings: CustomSearchEngineSetting) => void;
    initialEngineSetting: CustomSearchEngineSetting;
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

export const EditCustomSearchEngine = ({ initialEngineSetting, onSave }: EditCustomSearchEngineProps) => {
    const { t } = useTranslation("extension[CustomWebSearch]");

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [temporaryCustomSearchEngineSetting, setTemporaryCustomSearchEngineSetting] =
        useState<CustomSearchEngineSetting>(initialEngineSetting);
    const [validation, setValidation] = useState<Partial<Record<keyof CustomSearchEngineSetting, string>>>({});

    const openDialog = () => setIsDialogOpen(true);
    const closeDialog = () => {
        setTemporaryCustomSearchEngineSetting(initialEngineSetting);
        setIsDialogOpen(false);
    };

    useEffect(() => {
        setValidation(validateCustomSearchEngineSetting(temporaryCustomSearchEngineSetting));
    });

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
        <Dialog
            open={isDialogOpen}
            onOpenChange={(event, { open }) => {
                event.stopPropagation();
                if (open) {
                    openDialog();
                } else {
                    closeDialog();
                }
            }}
        >
            <DialogTrigger disableButtonEnhancement>
                <Button onClick={openDialog} icon={<AddRegular />}>
                    {t("addSearchEngine")}
                </Button>
            </DialogTrigger>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>{t("addSearchEngine")}</DialogTitle>
                    <DialogContent>
                        <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: 10 }}>
                            <Field
                                label={t("name")}
                                validationMessage={validation.name ? t(validation.name) : ""}
                                validationState={"name" in validation ? "error" : "success"}
                            >
                                <Input
                                    value={temporaryCustomSearchEngineSetting.name}
                                    onChange={(_, { value }) => setName(value)}
                                />
                            </Field>
                            <Field
                                label={t("prefix")}
                                validationMessage={validation.prefix ? t(validation.prefix) : ""}
                                validationState={"prefix" in validation ? "error" : "success"}
                            >
                                <Input
                                    value={temporaryCustomSearchEngineSetting.prefix}
                                    onChange={(_, { value }) => setPrefix(value)}
                                />
                            </Field>
                            <Field
                                label={t("searchEngineUrl")}
                                validationMessage={validation.url ? t(validation.url) : ""}
                                validationState={"url" in validation ? "error" : "success"}
                            >
                                <Input
                                    value={temporaryCustomSearchEngineSetting.url}
                                    onChange={(_, { value }) => setUrl(value)}
                                />
                            </Field>

                            <Checkbox
                                checked={temporaryCustomSearchEngineSetting.encodeSearchTerm}
                                onChange={(_, { checked }) => setEncodeSearchTerm(checked === true)}
                                label={t("encodeSearchTerm")}
                            />
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
                                closeDialog();
                                onSave(temporaryCustomSearchEngineSetting);
                            }}
                            appearance="primary"
                        >
                            {t("add")}
                        </Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};
