import type { FluentIcon, SearchResultItemAction } from "@common/Core";

/**
 * Creates an action to navigate to the given extension by its ID.
 * When returned action is invoked, the UI will navigate to the extension's custom UI page.
 */
export const createInvokeExtensionAction = ({
    extensionId,
    description,
    fluentIcon,
}: {
    extensionId: string;
    description: string;
    fluentIcon?: FluentIcon;
}): SearchResultItemAction => ({
    argument: `/extension/${extensionId}`,
    description,
    handlerId: "navigateTo",
    fluentIcon,
});
