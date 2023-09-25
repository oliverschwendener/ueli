import type { EventEmitter } from "../EventEmitter";
import type { EventSubscriber } from "../EventSubscriber";
import { InMemorySearchIndex } from "./InMemorySearchIndex";
import type { SearchIndex } from "./SearchIndex";

export type * from "./SearchIndex";

export const useSearchIndex = ({
    eventEmitter,
    eventSubscriber,
}: {
    eventEmitter: EventEmitter;
    eventSubscriber: EventSubscriber;
}): SearchIndex => {
    const searchIndex = new InMemorySearchIndex(eventEmitter);

    eventSubscriber.subscribe<{ pluginId: string }>("pluginDisabled", ({ pluginId }) =>
        searchIndex.removeSearchResultItems(pluginId),
    );

    return searchIndex;
};
