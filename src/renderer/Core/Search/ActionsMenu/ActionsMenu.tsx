import { KeyboardShortcut } from "@Core/Components";
import { type SearchResultItem, type SearchResultItemAction } from "@common/Core";
import {
    Button,
    Menu,
    MenuItem,
    MenuList,
    MenuPopover,
    MenuTrigger,
    Toast,
    ToastTitle,
    Toaster,
    Tooltip,
    useId,
    useToastController,
} from "@fluentui/react-components";
import { MoreVerticalFilled } from "@fluentui/react-icons";
import { useEffect, type Ref } from "react";
import { useTranslation } from "react-i18next";
import { FluentIcon } from "../FluentIcon";
import { getActions } from "./getActions";

type AdditionalActionsProps = {
    searchResultItem?: SearchResultItem;
    favorites: string[];
    invokeAction: (action: SearchResultItemAction) => void;
    additionalActionsButtonRef: Ref<HTMLButtonElement>;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    keyboardShortcut: string;
};

export const ActionsMenu = ({
    searchResultItem,
    favorites,
    invokeAction,
    additionalActionsButtonRef,
    open,
    onOpenChange,
    keyboardShortcut,
}: AdditionalActionsProps) => {
    const { t } = useTranslation();

    const toasterId = useId("copiedToClipboardToasterId");
    const { dispatchToast } = useToastController(toasterId);

    const actions = searchResultItem ? getActions(searchResultItem, favorites) : [];

    useEffect(() => {
        const copiedToClipboardHandler = () =>
            dispatchToast(
                <Toast>
                    <ToastTitle>{t("copiedToClipboard", { ns: "general" })}</ToastTitle>
                </Toast>,
                { intent: "success", position: "bottom" },
            );

        window.ContextBridge.ipcRenderer.on("copiedToClipboard", copiedToClipboardHandler);

        return () => {
            window.ContextBridge.ipcRenderer.off("copiedToClipboard", copiedToClipboardHandler);
        };
    }, []);

    return (
        <>
            <Toaster toasterId={toasterId} />
            <Menu open={open} onOpenChange={(_, { open }) => onOpenChange(open)}>
                <MenuTrigger>
                    <Tooltip
                        withArrow
                        positioning="above-end"
                        content={
                            <div style={{ display: "flex", flexDirection: "row", gap: 8 }}>
                                {t("actions", { ns: "general" })}
                                <KeyboardShortcut shortcut={keyboardShortcut} />
                            </div>
                        }
                        relationship="label"
                    >
                        <Button
                            disabled={!actions.length}
                            className="non-draggable-area"
                            size="small"
                            appearance="subtle"
                            ref={additionalActionsButtonRef}
                            icon={<MoreVerticalFilled fontSize={14} />}
                        />
                    </Tooltip>
                </MenuTrigger>
                <MenuPopover>
                    <MenuList>
                        {actions.map((action) => (
                            <MenuItem
                                key={`additional-action-${action.argument}-${action.handlerId}`}
                                onClick={() => invokeAction(action)}
                                icon={action.fluentIcon ? <FluentIcon icon={action.fluentIcon} /> : undefined}
                            >
                                {action.descriptionTranslation
                                    ? t(action.descriptionTranslation.key, {
                                          ns: action.descriptionTranslation.namespace,
                                      })
                                    : action.description}
                            </MenuItem>
                        ))}
                    </MenuList>
                </MenuPopover>
            </Menu>
        </>
    );
};
