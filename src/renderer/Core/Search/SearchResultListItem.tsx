import { ThemeContext } from "@Core/ThemeContext";
import { getImageUrl } from "@Core/getImageUrl";
import type { SearchResultItem } from "@common/Core";
import { Text } from "@fluentui/react-components";
import { useContext, useEffect, useRef, useState, type RefObject } from "react";
import { useTranslation } from "react-i18next";
import { elementIsVisible } from "./Helpers";

type SearchResultListItemProps = {
    containerRef: RefObject<HTMLDivElement>;
    isSelected: boolean;
    onClick: () => void;
    onDoubleClick: () => void;
    searchResultItem: SearchResultItem;
    scrollBehavior: ScrollBehavior;
};

export const SearchResultListItem = ({
    containerRef,
    isSelected,
    onClick,
    onDoubleClick,
    searchResultItem,
    scrollBehavior,
}: SearchResultListItemProps) => {
    const { t } = useTranslation();

    const { theme, shouldPreferDarkColors } = useContext(ThemeContext);
    const ref = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState<boolean>(false);

    const scrollIntoViewIfSelectedAndNotVisible = () => {
        if (containerRef.current && ref.current && isSelected && !elementIsVisible(ref.current, containerRef.current)) {
            ref.current?.scrollIntoView({ behavior: scrollBehavior, block: "nearest" });
        }
    };

    const selectedBackgroundColor = theme.colorNeutralBackground1Selected;
    const hoveredBackgroundColor = theme.colorNeutralBackground1Hover;

    useEffect(scrollIntoViewIfSelectedAndNotVisible, [isSelected]);

    return (
        <div
            ref={ref}
            key={searchResultItem.id}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                position: "relative",
                backgroundColor: isSelected ? selectedBackgroundColor : isHovered ? hoveredBackgroundColor : undefined,
                boxSizing: "border-box",
                color: isSelected ? theme.colorNeutralForeground1Selected : undefined,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: 10,
                height: 36,
                width: "100%",
                padding: 10,
                userSelect: "none",
                borderRadius: theme.borderRadiusMedium,
                cursor: "pointer",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    backgroundColor: isSelected ? theme.colorBrandForeground1 : "transparent",
                    height: "45%",
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
                    width: 20,
                    height: 20,
                }}
            >
                <img
                    alt={searchResultItem.name}
                    loading="lazy"
                    style={{
                        maxHeight: "100%",
                        maxWidth: "100%",
                    }}
                    src={getImageUrl({
                        image: searchResultItem.image,
                        shouldPreferDarkColors,
                    })}
                />
            </div>
            <Text
                size={300}
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
            </Text>
            <Text size={200} style={{ flexShrink: 0 }}>
                {searchResultItem.descriptionTranslation
                    ? t(searchResultItem.descriptionTranslation.key, {
                          ns: searchResultItem.descriptionTranslation.namespace,
                      })
                    : searchResultItem.description}
            </Text>
        </div>
    );
};
