import type { Image } from "./Image";

/**
 * Represents the information of an extension that is exposed to the renderer process.
 */
export type ExtensionInfo = {
    /**
     * The ID of the extension.
     */
    id: string;

    /**
     * The name of the extension.
     */
    name: string;

    /**
     * The author of the extension.
     */
    author: { name: string; githubUserName: string };

    /**
     * The image of the extension.
     */
    image: Image;

    /**
     * The translation of the extension name.
     */
    nameTranslation?: { key: string; namespace: string };
};
