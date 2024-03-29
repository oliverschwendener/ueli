import { useContextBridge } from "@Core/Hooks";
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
    useId,
    useToastController,
} from "@fluentui/react-components";
import { FlashRegular } from "@fluentui/react-icons";
import { useEffect, type Ref } from "react";
import { useTranslation } from "react-i18next";
import { FluentIcon } from "../FluentIcon";
import { getActions } from "./getActions";

type AdditionalActionsProps = {
    searchResultItem?: SearchResultItem;
    favorites: string[];
    invokeAction: (action: SearchResultItemAction) => void;
    additionalActionsButtonRef: Ref<HTMLButtonElement>;
    onMenuClosed: () => void;
};

export const ActionsMenu = ({
    searchResultItem,
    favorites,
    invokeAction,
    additionalActionsButtonRef,
    onMenuClosed,
}: AdditionalActionsProps) => {
    const { contextBridge } = useContextBridge();
    const { t } = useTranslation();

    const toasterId = useId("copiedToClipboardToasterId");
    const { dispatchToast } = useToastController(toasterId);

    const actions = searchResultItem ? getActions(searchResultItem, favorites) : [];

    useEffect(() => {
        contextBridge.ipcRenderer.on("copiedToClipboard", () =>
            dispatchToast(
                <Toast>
                    <ToastTitle>{t("copiedToClipboard", { ns: "general" })}</ToastTitle>
                </Toast>,
                { intent: "success", position: "bottom" },
            ),
        );
    }, []);

    return (
        <>
            <Toaster toasterId={toasterId} />
            <Menu onOpenChange={(_, { open }) => !open && onMenuClosed()}>
                <MenuTrigger>
                    <Button
                        disabled={!actions.length}
                        className="non-draggable-area"
                        size="small"
                        appearance="subtle"
                        icon={<FlashRegular fontSize={14} />}
                        ref={additionalActionsButtonRef}
                    >
                        {t("actions", { ns: "general" })}
                    </Button>
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
