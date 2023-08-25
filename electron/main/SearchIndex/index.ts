import { EventEmitter } from "../EventEmitter";
import { InMemorySearchIndex } from "./InMemorySearchIndex";

export * from "./SearchIndex";

export const useSearchIndex = (eventEmitter: EventEmitter) => {
    const searchIndex = new InMemorySearchIndex(eventEmitter);

    return { searchIndex };
};
