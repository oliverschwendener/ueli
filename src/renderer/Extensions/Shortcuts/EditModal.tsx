import { useContextBridge } from "@Core/Hooks";
import type { Shortcut, ShortcutType } from "@common/Extensions/Shortcuts";
import {
    Button,
    Dialog,
    DialogActions,
    DialogBody,
    DialogContent,
    DialogSurface,
    DialogTitle,
    DialogTrigger,
    DialogTriggerProps,
    Dropdown,
    Field,
    Input,
    Option,
    Switch,
    Tooltip,
} from "@fluentui/react-components";
import { FolderRegular } from "@fluentui/react-icons";
import { useState, type ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { isValidFilePath } from "./isValidFilePath";
import { isValidName } from "./isValidName";
import { isValidShortcut } from "./isValidShortcut";
import { isValidUrl } from "./isValidUrl";

type EditModalProps = {
    title: string;
    shortcutToEdit: Shortcut;
    dialogTrigger: DialogTriggerProps["children"];
    save: (shortcut: Shortcut) => void;
    canEditType?: boolean;
};

export const EditModal = ({
    title,
    shortcutToEdit: initialShortcut,
    save,
    dialogTrigger,
    canEditType,
}: EditModalProps) => {
    const { contextBridge } = useContextBridge();
    const { t } = useTranslation();
    const ns = "extension[Shortcuts]";

    const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);
    const [temporaryShortcut, setTemporaryShortcut] = useState<Shortcut>(initialShortcut);

    const resetTemporaryShortcut = () => setTemporaryShortcut(initialShortcut);

    const setProperty = (property: keyof Shortcut, value: unknown) =>
        setTemporaryShortcut({
            ...temporaryShortcut,
            ...{ [property]: value },
        });

    const types: Record<ShortcutType, string> = {
        File: t("typeFile", { ns }),
        Url: t("typeUrl", { ns }),
    };

    const openFileDialog = async () => {
        const result = await contextBridge.showOpenDialog({ properties: ["openFile", "openDirectory"] });

        if (result.filePaths.length) {
            setProperty("argument", result.filePaths[0]);
        }
    };

    const argumentElements: Record<ShortcutType, ReactElement> = {
        File: (
            <Field
                label={t("filePath", { ns })}
                validationMessage={
                    isValidFilePath(temporaryShortcut.argument) ? undefined : t("fileOrFolderDoesNotExist", { ns })
                }
                validationState={isValidFilePath(temporaryShortcut.argument) ? "success" : "error"}
            >
                <Input
                    value={temporaryShortcut.argument}
                    onChange={(_, { value }) => setProperty("argument", value)}
                    placeholder={t("typeFile", { ns })}
                    contentAfter={
                        <Tooltip content={t("chooseFile", { ns })} relationship="label">
                            <Button
                                size="small"
                                appearance="subtle"
                                icon={<FolderRegular />}
                                onClick={() => openFileDialog()}
                            />
                        </Tooltip>
                    }
                />
            </Field>
        ),
        Url: (
            <Field
                label={t("typeUrl", { ns })}
                validationMessage={isValidUrl(temporaryShortcut.argument) ? undefined : "Invalid URL"}
                validationState={isValidUrl(temporaryShortcut.argument) ? "success" : "error"}
            >
                <Input
                    value={temporaryShortcut.argument}
                    onChange={(_, { value }) => setProperty("argument", value)}
                    placeholder={t("typeUrl", { ns })}
                />
            </Field>
        ),
    };

    return (
        <Dialog
            open={dialogIsOpen}
            onOpenChange={(_, { open }) => {
                setDialogIsOpen(open);

                if (!open) {
                    resetTemporaryShortcut();
                }
            }}
        >
            <DialogTrigger disableButtonEnhancement>{dialogTrigger}</DialogTrigger>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogContent>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            <Field label={t("type", { ns })}>
                                <Dropdown
                                    disabled={!canEditType}
                                    value={types[temporaryShortcut.type]}
                                    selectedOptions={[temporaryShortcut.type]}
                                    onOptionSelect={(_, { optionValue }) =>
                                        optionValue && setProperty("type", optionValue)
                                    }
                                >
                                    {Object.keys(types).map((type) => (
                                        <Option key={`dropdown-option-${type}`} value={type}>
                                            {types[type as ShortcutType]}
                                        </Option>
                                    ))}
                                </Dropdown>
                            </Field>
                            <Field
                                label={t("name", { ns })}
                                validationMessage={
                                    isValidName(temporaryShortcut.name) ? undefined : t("invalidName", { ns })
                                }
                                validationState={isValidName(temporaryShortcut.name) ? "success" : "error"}
                            >
                                <Input
                                    value={temporaryShortcut.name}
                                    onChange={(_, { value }) => setProperty("name", value)}
                                    placeholder="Name"
                                />
                            </Field>
                            {argumentElements[temporaryShortcut.type]}
                            <Field label={t("hideWindowAfterInvokation", { ns })}>
                                <Switch
                                    checked={temporaryShortcut.hideWindowAfterInvokation}
                                    onChange={(_, { checked }) => setProperty("hideWindowAfterInvokation", checked)}
                                />
                            </Field>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <DialogTrigger disableButtonEnhancement>
                            <Button appearance="secondary">{t("cancel", { ns })}</Button>
                        </DialogTrigger>
                        <Button
                            disabled={!isValidShortcut(temporaryShortcut)}
                            onClick={() => {
                                save(temporaryShortcut);
                                setDialogIsOpen(false);
                            }}
                            appearance="primary"
                        >
                            {t("save", { ns })}
                        </Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};
