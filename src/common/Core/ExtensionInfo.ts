export type ExtensionInfo = {
    id: string;
    name: string;
    nameTranslationKey: string;
    author: {
        name: string;
        githubUserName: string;
    };
    imageUrl?: string;
};
