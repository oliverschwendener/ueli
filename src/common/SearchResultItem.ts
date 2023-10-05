export type SearchResultItem = {
    id: string;
    name: string;
    nameTranslationKey?: string;
    description: string;
    descriptionTranslationKey?: string;
    imageUrl?: string;
    executionServiceId: string;
    executionServiceArgument: string;
    hideWindowAfterExecution: boolean;
};
