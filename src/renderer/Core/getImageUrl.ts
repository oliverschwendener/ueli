import type { Image } from "@shared/Core/Image";

export const getImageUrl = ({ image, shouldUseDarkColors }: { image: Image; shouldUseDarkColors: boolean }): string => {
    return shouldUseDarkColors ? (image.urlOnDarkBackground ?? image.url) : (image.urlOnLightBackground ?? image.url);
};
