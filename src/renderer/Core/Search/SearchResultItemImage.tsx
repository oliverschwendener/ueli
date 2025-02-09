import type { SearchResultItem } from "@common/Core";
import { getImageUrl } from "@Core/getImageUrl";
import { ThemeContext } from "@Core/Theme";
import { useContext } from "react";

type SearchResultItemImageProps = {
    image: SearchResultItem["image"];
    altText: string;
    size: number;
};

export const SearchResultItemImage = ({ image, altText, size }: SearchResultItemImageProps) => {
    const { shouldUseDarkColors } = useContext(ThemeContext);

    return (
        <div
            style={{
                alignItems: "center",
                display: "flex",
                flexDirection: "row",
                flexShrink: 0,
                justifyContent: "center",
                width: size,
                height: size,
            }}
        >
            <img
                alt={altText}
                loading="lazy"
                style={{
                    maxHeight: "100%",
                    maxWidth: "100%",
                }}
                src={getImageUrl({ image, shouldUseDarkColors })}
            />
        </div>
    );
};
