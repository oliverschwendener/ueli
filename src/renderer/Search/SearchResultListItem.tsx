import type { SearchResultItem } from "@common/SearchResultItem";
import type { SearchResultItemAction } from "@common/SearchResultItemAction";
import { Button, Menu, MenuItem, MenuList, MenuPopover, MenuTrigger, Text } from "@fluentui/react-components";
import { FlashRegular } from "@fluentui/react-icons";
import { useContext, useEffect, useRef, type RefObject } from "react";
import { useTranslation } from "react-i18next";
import { useContextBridge } from "../Hooks";
import { ThemeContext } from "../ThemeContext";
import { elementIsVisible } from "./Helpers";

type SearchResultListItemProps = {
    containerRef: RefObject<HTMLDivElement>;
    isSelected: boolean;
    onClick: () => void;
    onDoubleClick: () => void;
    searchResultItem: SearchResultItem;
};

export const SearchResultListItem = ({
    containerRef,
    isSelected,
    onClick,
    onDoubleClick,
    searchResultItem,
}: SearchResultListItemProps) => {
    const { contextBridge } = useContextBridge();
    const { t } = useTranslation();
    const { theme } = useContext(ThemeContext);
    const ref = useRef<HTMLDivElement>(null);

    const scrollIntoViewIfSelectedAndNotVisible = () => {
        if (containerRef.current && ref.current && isSelected && !elementIsVisible(ref.current, containerRef.current)) {
            setTimeout(() => ref.current?.scrollIntoView({ behavior: "smooth" }), 50);
        }
    };

    const invokeAction = (action: SearchResultItemAction) => contextBridge.invokeAction(action);

    useEffect(scrollIntoViewIfSelectedAndNotVisible, [isSelected]);

    return (
        <div
            ref={ref}
            key={searchResultItem.id}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            style={{
                alignItems: "center",
                backgroundColor: isSelected ? theme.colorSubtleBackgroundSelected : undefined,
                boxSizing: "border-box",
                color: isSelected ? theme.colorNeutralForeground1Selected : undefined,
                display: "flex",
                flexDirection: "row",
                gap: 10,
                height: 42,
                padding: 10,
                userSelect: "none",
            }}
        >
            <div
                style={{
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "row",
                    flexShrink: 0,
                    justifyContent: "center",
                    width: 24,
                }}
            >
                <img
                    style={{
                        maxHeight: "100%",
                        maxWidth: "100%",
                    }}
                    src={searchResultItem.imageUrl}
                />
            </div>
            <div
                style={{
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "row",
                    flexGrow: 1,
                    justifyContent: "space-between",
                    gap: 10,
                }}
            >
                <div
                    style={{
                        alignItems: "center",
                        display: "flex",
                        flexDirection: "row",
                        flexGrow: 1,
                        justifyContent: "space-between",
                    }}
                >
                    <Text>{searchResultItem.name}</Text>
                    <Text size={200}>
                        {searchResultItem.descriptionTranslationKey
                            ? t(searchResultItem.descriptionTranslationKey)
                            : searchResultItem.description}
                    </Text>
                </div>
                <Menu>
                    <MenuTrigger>
                        <Button icon={<FlashRegular />} size="small" appearance="subtle"></Button>
                    </MenuTrigger>
                    <MenuPopover>
                        <MenuList>
                            {searchResultItem.additionalActions?.map((action, index) => (
                                <MenuItem
                                    key={`action-${action.argument}-${index}`}
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
            </div>
        </div>
    );
};
