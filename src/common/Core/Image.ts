/**
 * Represents an image that can be displayed in the renderer process.
 */
export type Image = {
    /**
     * The URL of the image, e.g.: `https://example.com/my-image.png` or `file://C:\example\my-image.png`.
     * This URL is being used when urlOnDarkBackground and urlOnLightBackground are not set.
     */
    url: string;

    /**
     * The URL of the image that will be used on a dark background, e.g.:
     * `https://example.com/my-image-on-dark-background.png` or `file://C:\example\my-image-on-dark-background.png`.
     */
    urlOnDarkBackground?: string;

    /**
     * The URL of the image that will be used on a light background, e.g.:
     * `https://example.com/my-image-on-light-background.png` or `file://C:\example\my-image-on-light-background.png`.
     */
    urlOnLightBackground?: string;
};
