import type { Image } from "@common/Core/Image";

export const getImageUrl = ({ image, onDarkBackground }: { image: Image; onDarkBackground: boolean }) => {
    return (onDarkBackground ? image.urlOnDarkBackground : image.urlOnLightBackground) ?? image.url;
};
