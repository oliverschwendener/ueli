import type { UeliPlugin } from "@common/UeliPlugin";

export const addSearchResultItemsToSearchIndex = (plugins: UeliPlugin[]) => {
    for (const plugin of plugins) {
        plugin.addSearchResultItemsToSearchIndex();
    }
};
