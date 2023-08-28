import { EventEmitter } from "../EventEmitter";
import { InMemorySearchIndex } from "./InMemorySearchIndex";
import { SearchIndex } from "./SearchIndex";

export * from "./SearchIndex";

export const useSearchIndex = ({ eventEmitter }: { eventEmitter: EventEmitter }): SearchIndex =>
    new InMemorySearchIndex(eventEmitter);
