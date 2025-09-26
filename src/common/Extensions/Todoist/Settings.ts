export type TaskOpenTarget = "browser" | "desktopApp";

export type Settings = {
    quickAddPrefix: string;
    taskListPrefix: string;
    suggestionLimit: number;
    taskListLimit: number;
    taskOpenTarget: TaskOpenTarget;
    taskFilter: string;
    apiToken: string;
};
