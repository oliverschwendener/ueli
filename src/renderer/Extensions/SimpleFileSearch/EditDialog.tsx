import type { FolderSetting } from "@common/Extensions/SimpleFileSearch";
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
    Dropdown,
    Field,
    Input,
    Option,
    tokens,
    Tooltip,
} from "@fluentui/react-components";
import { FolderRegular } from "@fluentui/react-icons";
import { type ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";

type State = FolderSetting & { isValidPath: boolean };

const createFolderSetting = (): FolderSetting => ({
    id: crypto.randomUUID(),
    path: "",
    recursive: false,
    searchFor: "filesAndFolders",
});

const folderSettingToState = (folderSetting: FolderSetting): State => ({
    ...folderSetting,
    isValidPath: window.ContextBridge.fileExists(folderSetting.path),
});

const stateToFolderSetting = ({ id, path, recursive, searchFor }: State): FolderSetting => ({
    id,
    path,
    recursive,
    searchFor,
});

type EditDialogProps = {
    title: string;
    trigger: ReactElement;
    confirm: string;
    cancel: string;
    folderSetting?: FolderSetting;
    onSave: (folderSetting: FolderSetting) => void;
};

export const EditDialog = ({ title, trigger, confirm, cancel, folderSetting, onSave }: EditDialogProps) => {
    const { t } = useTranslation("extension[SimpleFileSearch]");

    const [dialogIsOpen, setDialogIsOpen] = useState(false);

    const [state, setState] = useState<State>(folderSettingToState(folderSetting ?? createFolderSetting()));

    const updatePath = (path: string) => {
        setState({
            ...state,
            path,
            isValidPath: window.ContextBridge.fileExists(path),
        });
    };

    const updateSearchFor = (searchFor: FolderSetting["searchFor"]) => {
        setState({
            ...state,
            searchFor,
        });
    };

    const updateRecursiveness = (recursive: boolean) => {
        setState({
            ...state,
            recursive,
        });
    };

    const openFileDialog = async () => {
        const result = await window.ContextBridge.showOpenDialog({ properties: ["openDirectory"] });

        if (!result.canceled && result.filePaths.length) {
            updatePath(result.filePaths[0]);
        }
    };

    const resetToInitialState = () => setState(folderSettingToState(folderSetting ?? createFolderSetting()));

    return (
        <Dialog open={dialogIsOpen} onOpenChange={(_, { open }) => setDialogIsOpen(open)}>
            <DialogTrigger disableButtonEnhancement>{trigger}</DialogTrigger>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogContent>
                        <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacingVerticalM }}>
                            <Field
                                validationState={state.isValidPath ? "success" : "error"}
                                validationMessage={state.isValidPath ? t("validFolderPath") : t("invalidFolderPath")}
                                label={t("path")}
                            >
                                <Input
                                    value={state.path}
                                    onChange={(_, { value }) => updatePath(value)}
                                    contentAfter={
                                        <Tooltip withArrow relationship="label" content={t("chooseFolder")}>
                                            <Button
                                                size="small"
                                                appearance="subtle"
                                                icon={<FolderRegular />}
                                                onClick={openFileDialog}
                                            />
                                        </Tooltip>
                                    }
                                />
                            </Field>
                            <Field label={t("searchFor")}>
                                <Dropdown
                                    value={t(`searchFor.${state.searchFor}`)}
                                    selectedOptions={[state.searchFor]}
                                    onOptionSelect={(_, { optionValue }) =>
                                        updateSearchFor(optionValue as FolderSetting["searchFor"])
                                    }
                                >
                                    <Option value="files">{t("searchFor.files")}</Option>
                                    <Option value="folders">{t("searchFor.folders")}</Option>
                                    <Option value="filesAndFolders">{t("searchFor.filesAndFolders")}</Option>
                                </Dropdown>
                            </Field>
                            <Checkbox
                                label={t("recursive")}
                                checked={state.recursive}
                                onChange={(_, { checked }) => updateRecursiveness(checked === true)}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            disabled={!state.isValidPath}
                            onClick={() => {
                                onSave(stateToFolderSetting(state));
                                setDialogIsOpen(false);
                            }}
                            appearance="primary"
                        >
                            {confirm}
                        </Button>
                        <DialogTrigger disableButtonEnhancement>
                            <Button onClick={resetToInitialState} appearance="secondary">
                                {cancel}
                            </Button>
                        </DialogTrigger>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};
