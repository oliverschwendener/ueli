import type { Image } from "@common/Core/Image";

export interface UrlImageGenerator {
    getImage(url: string): Image;
}
