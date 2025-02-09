import type { BadgeProps, TextProps } from "@fluentui/react-components";

export type SearchResultListItemStyleOptions = {
    showIcon: boolean;
    showDescription: boolean;
    descriptionColor: BadgeProps["color"];
    nameTextSize: TextProps["size"];
    nameTextWeight: TextProps["weight"];
    detailsTextSize: TextProps["size"];
};
