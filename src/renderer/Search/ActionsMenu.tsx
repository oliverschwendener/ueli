import { SearchResultItemAction } from "@common/SearchResultItemAction";
import { Button, Menu, MenuItem, MenuList, MenuPopover, MenuTrigger } from "@fluentui/react-components";
import { FlashRegular } from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";

type AdditionalActionsProps = {
    actions: SearchResultItemAction[];
    invokeAction: (action: SearchResultItemAction) => void;
    additionalActionsButtonRef: React.Ref<HTMLButtonElement>;
    onMenuClosed: () => void;
};

export const ActionsMenu = ({
    actions,
    invokeAction,
    additionalActionsButtonRef,
    onMenuClosed,
}: AdditionalActionsProps) => {
    const { t } = useTranslation();

    return (
        <Menu onOpenChange={(_, { open }) => !open && onMenuClosed()}>
            <MenuTrigger>
                <Button
                    disabled={actions.length === 0}
                    className="non-draggable-area"
                    size="small"
                    appearance="subtle"
                    icon={<FlashRegular />}
                    ref={additionalActionsButtonRef}
                >
                    {t("general.actions")}
                </Button>
            </MenuTrigger>
            <MenuPopover>
                <MenuList>
                    {actions.map((action) => (
                        <MenuItem
                            key={`additional-action-${action.argument}-${action.handlerId}`}
                            onClick={() => invokeAction(action)}
                        >
                            {action.descriptionTranslationKey
                                ? t(action.descriptionTranslationKey)
                                : action.description}
                        </MenuItem>
                    ))}
                </MenuList>
            </MenuPopover>
        </Menu>
    );
};
