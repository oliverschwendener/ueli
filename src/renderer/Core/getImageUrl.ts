import type { Image } from "@common/Core/Image";

export const getImageUrl = ({ image, shouldPreferDarkColors }: { image: Image; shouldPreferDarkColors: boolean }) => {
    return shouldPreferDarkColors ? image.urlOnDarkBackground ?? image.url : image.urlOnLightBackground ?? image.url;
};
