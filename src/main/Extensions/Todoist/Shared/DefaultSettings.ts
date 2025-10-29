import type { Settings } from "@common/Extensions/Todoist";

export const todoistDefaultSettings: Settings = Object.freeze({
    quickAddPrefix: "todo",
    taskListPrefix: "tdl",
    suggestionLimit: 15,
    taskListLimit: 30,
    taskOpenTarget: "browser",
    taskFilter: "",
    apiToken: "",
});
