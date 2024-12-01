import type { SearchResultItemAction } from "@common/Core";

/**
 * Creates an action to open the given URL in the default browser.
 */
export const createOpenUrlSearchResultAction = ({ url }: { url: string }): SearchResultItemAction => ({
    argument: url,
    description: "Open URL in browser",
    descriptionTranslation: {
        key: "openUrlInBrowser",
        namespace: "searchResultItemAction",
    },
    handlerId: "Url",
    fluentIcon: "OpenRegular",
    hideWindowAfterInvocation: true,
});
