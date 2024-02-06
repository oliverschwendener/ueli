import type { SearchResultItem } from "@common/Core";
import { Text } from "@fluentui/react-components";
import { StarFilled } from "@fluentui/react-icons";
import { useContext, useEffect, useRef, type RefObject } from "react";
import { useTranslation } from "react-i18next";
import { useContextBridge } from "../Hooks";
import { ThemeContext } from "../ThemeContext";
import { elementIsVisible } from "./Helpers";

type SearchResultListItemProps = {
    containerRef: RefObject<HTMLDivElement>;
    isSelected: boolean;
    isFavorite: boolean;
    onClick: () => void;
    onDoubleClick: () => void;
    searchResultItem: SearchResultItem;
};

export const SearchResultListItem = ({
    containerRef,
    isSelected,
    isFavorite,
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

    const imageUrl = () =>
        contextBridge.themeShouldUseDarkColors()
            ? searchResultItem.imageUrlOnDarkBackground ?? searchResultItem.imageUrl
            : searchResultItem.imageUrlOnLightBackground ?? searchResultItem.imageUrl;

    useEffect(scrollIntoViewIfSelectedAndNotVisible, [isSelected]);

    return (
        <div
            ref={ref}
            key={searchResultItem.id}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            style={{
                position: "relative",
                backgroundColor: isSelected ? theme.colorSubtleBackgroundSelected : undefined,
                boxSizing: "border-box",
                color: isSelected ? theme.colorNeutralForeground1Selected : undefined,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: 10,
                height: 42,
                width: "100%",
                padding: 10,
                userSelect: "none",
                borderRadius: theme.borderRadiusMedium,
            }}
        >
            <div
                style={{
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    backgroundColor: isSelected ? theme.colorBrandForeground1 : "transparent",
                    height: 16,
                    width: 3,
                    transform: "translateY(-50%)",
                    borderRadius: theme.borderRadiusLarge,
                }}
            ></div>
            <div
                style={{
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "row",
                    flexShrink: 0,
                    justifyContent: "center",
                    width: 24,
                    height: 24,
                }}
            >
                <img
                    style={{
                        maxHeight: "100%",
                        maxWidth: "100%",
                    }}
                    src={imageUrl()}
                />
            </div>
            <div
                style={{
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                }}
            >
                {searchResultItem.name}
                {isFavorite ? <StarFilled /> : null}
            </div>
            <div style={{ flexShrink: 0 }}>
                <Text size={200}>
                    {searchResultItem.descriptionTranslation
                        ? t(searchResultItem.descriptionTranslation.key, {
                              ns: searchResultItem.descriptionTranslation.namespace,
                          })
                        : searchResultItem.description}
                </Text>
            </div>
        </div>
    );
};
