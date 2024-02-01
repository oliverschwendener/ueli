import type { SearchResultItemAction } from "@common/Core";
import { Button, Menu, MenuItem, MenuList, MenuPopover, MenuTrigger } from "@fluentui/react-components";
import { FlashRegular } from "@fluentui/react-icons";
import type { Ref } from "react";
import { useTranslation } from "react-i18next";
import { FluentIcon } from "./FluentIcon";

type AdditionalActionsProps = {
    actions: SearchResultItemAction[];
    invokeAction: (action: SearchResultItemAction) => void;
    additionalActionsButtonRef: Ref<HTMLButtonElement>;
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
                    icon={<FlashRegular fontSize={14} />}
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
                            icon={action.fluentIcon ? <FluentIcon icon={action.fluentIcon} /> : undefined}
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
