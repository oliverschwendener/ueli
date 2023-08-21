import { SearchResultItem } from "@common/SearchResultItem";
import { Text } from "@fluentui/react-components";
import { RefObject, useContext, useEffect, useRef } from "react";
import { ThemeContext } from "../ThemeContext";
import { elementIsVisible } from "./helpers";

type SearchResultListItemProps = {
    containerRef: RefObject<HTMLDivElement>;
    isSelected: boolean;
    searchResultItem: SearchResultItem;
};

export const SearchResultListItem = ({ containerRef, isSelected, searchResultItem }: SearchResultListItemProps) => {
    const { theme } = useContext(ThemeContext);
    const ref = useRef<HTMLDivElement>(null);

    const scrollIntoViewIfSelectedAndNotVisible = () => {
        if (containerRef.current && ref.current && isSelected && !elementIsVisible(ref.current, containerRef.current)) {
            setTimeout(() => ref.current?.scrollIntoView({ behavior: "smooth" }), 50);
        }
    };

    useEffect(scrollIntoViewIfSelectedAndNotVisible, [isSelected]);

    return (
        <div
            ref={ref}
            key={searchResultItem.id}
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                padding: 10,
                gap: 10,
                boxSizing: "border-box",
                backgroundColor: isSelected ? theme.colorSubtleBackgroundSelected : undefined,
                color: isSelected ? theme.colorNeutralForeground1Selected : undefined,
            }}
        >
            <div
                style={{
                    width: 24,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    flexShrink: 0,
                }}
            >
                <img style={{ maxHeight: "100%", maxWidth: "100%" }} alt="" src={searchResultItem.icon} />
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexGrow: 1,
                }}
            >
                <Text>{searchResultItem.name}</Text>
                <Text size={200}>{searchResultItem.description}</Text>
            </div>
        </div>
    );
};
