import { SearchResultItem } from "../search-engine";

export interface Executor {
    execute(executionArgument: string): void;
    hideAfterExecution(): boolean;
}