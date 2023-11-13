import { SearchResultItemAction } from "@common/SearchResultItemAction";
import { Button, Menu, MenuItem, MenuList, MenuPopover, MenuTrigger } from "@fluentui/react-components";
import { FlashRegular } from "@fluentui/react-icons";

type AdditionalActionsProps = {
    actions: SearchResultItemAction[];
    invokeAction: (action: SearchResultItemAction) => void;
    additionalActionsButtonRef: React.Ref<HTMLButtonElement>;
    onMenuClosed: () => void;
};

export const AdditionalActions = ({
    actions,
    invokeAction,
    additionalActionsButtonRef,
    onMenuClosed,
}: AdditionalActionsProps) => {
    return (
        <Menu
            onOpenChange={(_, { open }) => {
                if (!open) {
                    onMenuClosed();
                }
            }}
        >
            <MenuTrigger>
                <Button
                    disabled={actions.length === 0}
                    className="non-draggable-area"
                    size="small"
                    appearance="subtle"
                    icon={<FlashRegular />}
                    ref={additionalActionsButtonRef}
                >
                    Actions
                </Button>
            </MenuTrigger>
            <MenuPopover>
                <MenuList>
                    {actions.map((action) => (
                        <MenuItem
                            key={`additional-action-${action.argument}-${action.handlerId}`}
                            onClick={() => invokeAction(action)}
                        >
                            {action.description}
                        </MenuItem>
                    ))}
                </MenuList>
            </MenuPopover>
        </Menu>
    );
};
