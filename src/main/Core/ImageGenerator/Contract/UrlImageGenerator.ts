import type { Image } from "@common/Core/Image";

/**
 * Module for generating images from URLs.
 */
export interface UrlImageGenerator {
    /**
     * Gets an image from a URL.
     * @param url The URL, e.g.: `"https://example.com"`.
     */
    getImage(url: string): Image;
}
