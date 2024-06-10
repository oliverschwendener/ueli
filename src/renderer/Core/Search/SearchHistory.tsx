import { Button, Menu, MenuItem, MenuList, MenuPopover, MenuTrigger, Tooltip } from "@fluentui/react-components";
import { HistoryRegular } from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";

type SearchHistoryProps = {
    onItemSelected: (historyItem: string) => void;
    menuIsOpen: boolean;
    onMenuClosed: () => void;
    searchHistory: string[];
    setMenuIsOpen: (menuIsOpen: boolean) => void;
};

export const SearchHistory = ({
    onItemSelected,
    menuIsOpen,
    onMenuClosed,
    searchHistory,
    setMenuIsOpen,
}: SearchHistoryProps) => {
    const { t } = useTranslation("search");

    return (
        <Menu
            open={menuIsOpen}
            onOpenChange={(_, { open }) => {
                setMenuIsOpen(open);
                !open && onMenuClosed();
            }}
        >
            <MenuTrigger>
                <Tooltip relationship="label" content={t("searchHistory")}>
                    <Button
                        appearance="subtle"
                        size="small"
                        icon={<HistoryRegular />}
                        disabled={searchHistory.length === 0}
                    />
                </Tooltip>
            </MenuTrigger>
            <MenuPopover>
                <MenuList>
                    {searchHistory.map((historyItem) => (
                        <MenuItem
                            key={`search-term-history-item[${historyItem}]`}
                            onFocus={() => onItemSelected(historyItem)}
                            onClick={() => onItemSelected(historyItem)}
                        >
                            {historyItem}
                        </MenuItem>
                    ))}
                </MenuList>
            </MenuPopover>
        </Menu>
    );
};
