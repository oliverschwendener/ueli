import type { EventEmitter } from "../EventEmitter";
import { InMemorySearchIndex } from "./InMemorySearchIndex";
import type { SearchIndex } from "./SearchIndex";

export * from "./SearchIndex";

export const useSearchIndex = ({ eventEmitter }: { eventEmitter: EventEmitter }): SearchIndex =>
    new InMemorySearchIndex(eventEmitter);
