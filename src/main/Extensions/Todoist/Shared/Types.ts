import type { Task } from "@doist/todoist-api-typescript";

export type TodoistEntity = {
    id: string;
    name: string;
};

export type TodoistTriggerSymbol = "@" | "#" | "!";

export type TodoistTrigger = {
    symbol: TodoistTriggerSymbol;
    fragment: string;
    bodyWithoutTrigger: string;
};

export type TodoistTaskIssue = {
    message: string;
    searchTerm: string;
    timestamp: number;
};

export type TodoistTaskSnapshot = {
    tasks: Task[];
    lastError?: string;
    lastFilterError: boolean;
    isRefreshing: boolean;
};
