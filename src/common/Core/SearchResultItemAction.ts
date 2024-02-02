import type { FluentIcon } from "./FluentIcon";

export type SearchResultItemAction = {
    description: string;
    descriptionTranslation?: { key: string; namespace: string };
    argument: string;
    handlerId: string;
    hideWindowAfterInvocation: boolean;
    requiresConfirmation?: boolean;
    fluentIcon?: FluentIcon;
};
