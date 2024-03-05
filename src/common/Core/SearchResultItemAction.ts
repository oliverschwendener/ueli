import type { FluentIcon } from "./FluentIcon";

/**
 * Represents an action that can be invoked from the search result list.
 */
export type SearchResultItemAction = {
    /**
     * The description of the action. This will be shown in the flyout of the additional actions menu.
     */
    description: string;

    /**
     * The translation of the description. If given, this will be used instead of the description.
     */
    descriptionTranslation?: { key: string; namespace: string };

    /**
     * The argument that will be passed to the action handler when invoking the action.
     */
    argument: string;

    /**
     * The ID of the action handler that will be invoked when invoking the action.
     */
    handlerId: string;

    /**
     * Determines if the window should be hidden after invoking the action.
     */
    hideWindowAfterInvocation: boolean;

    /**
     * Determines if the action requires confirmation before invoking.
     */
    requiresConfirmation?: boolean;

    /**
     * The icon of the action. This icon will be used in the additional actions menu.
     */
    fluentIcon?: FluentIcon;
};
