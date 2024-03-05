import type { Image } from "@common/Core/Image";

/**
 * Module for generating images from files.
 */
export interface FileImageGenerator {
    /**
     * Get an image from a file path.
     * @param filePath The file path, e.g.: `"C:/path/to/image.png"`.
     */
    getImage(filePath: string): Promise<Image>;

    /**
     * Gets images from file paths.
     * @param filePaths The file paths, e.g.: `["C:/path/to/image1.png", "C:/path/to/image2.png"]`.
     * @returns A promise that resolves to a record of images, where the key is the file path.
     *
     * Silently fails if it fails to generate an image for one of the file paths. The failing file path won't be
     * included in the resulting record.
     */
    getImages(filePaths: string[]): Promise<Record<string, Image>>;
}
