import type { SearchResultItemAction } from "@shared/Core";

/**
 * An ActionHandler is responsible for handling a SearchResultItemAction.
 *
 * This could be for example opening a file, URL, executing a command, or anything else.
 */
export interface ActionHandler {
    /**
     * A unique identifier for this ActionHandler.
     */
    readonly id: string;

    /**
     * Invokes the given SearchResultItemAction.
     */
    invokeAction(action: SearchResultItemAction): Promise<void>;
}
