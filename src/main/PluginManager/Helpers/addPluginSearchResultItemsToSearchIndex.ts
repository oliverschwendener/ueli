import type { SearchIndex } from "@common/SearchIndex";
import type { UeliPlugin } from "@common/UeliPlugin";

export const addSearchResultItemsToSearchIndex = async ({
    plugins,
    searchIndex,
}: {
    plugins: UeliPlugin[];
    searchIndex: SearchIndex;
}) => {
    const promiseResults = await Promise.allSettled(plugins.map((plugin) => plugin.getSearchResultItems()));

    for (let i = 0; i < plugins.length; i++) {
        const promiseResult = promiseResults[i];
        const { id: pluginId } = plugins[i];

        promiseResult.status === "fulfilled"
            ? searchIndex.addSearchResultItems(pluginId, promiseResult.value)
            : console.error({
                  error: "Failed ot get search result items by plugin",
                  pluginId: pluginId,
                  reason: promiseResult.reason,
              });
    }
};
