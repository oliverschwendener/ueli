import type { Image } from "./Image";

export type ExtensionInfo = {
    id: string;
    name: string;
    author: { name: string; githubUserName: string };
    nameTranslation?: { key: string; namespace: string };
    image: Image;
};
