import type { FluentIcon } from "./FluentIcon";

export type SearchResultItemAction = {
    description: string;
    descriptionTranslationKey?: string;
    argument: string;
    handlerId: string;
    hideWindowAfterInvokation: boolean;
    requiresConfirmation?: boolean;
    fluentIcon?: FluentIcon;
};
