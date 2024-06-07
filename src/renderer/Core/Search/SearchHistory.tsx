import { Button, Menu, MenuItem, MenuList, MenuPopover, MenuTrigger, Tooltip } from "@fluentui/react-components";
import { HistoryRegular } from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";

type SearchHistoryProps = {
    searchHistory: string[];
    menuIsOpen: boolean;
    setMenuIsOpen: (menuIsOpen: boolean) => void;
    itemSelected: (historyItem: string) => void;
};

export const SearchHistory = ({ searchHistory, menuIsOpen, setMenuIsOpen, itemSelected }: SearchHistoryProps) => {
    const { t } = useTranslation("search");

    return (
        <Menu open={menuIsOpen} onOpenChange={(_, { open }) => setMenuIsOpen(open)}>
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
                            onFocus={() => itemSelected(historyItem)}
                        >
                            {historyItem}
                        </MenuItem>
                    ))}
                </MenuList>
            </MenuPopover>
        </Menu>
    );
};
