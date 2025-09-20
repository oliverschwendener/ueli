import { TodoistApi } from "@doist/todoist-api-typescript";

export type TodoistApiClient = Pick<TodoistApi, "quickAddTask" | "getLabels" | "getProjects">;

export interface TodoistApiFactory {
    create(apiToken: string): TodoistApiClient;
}

export class DefaultTodoistApiFactory implements TodoistApiFactory {
    public create(apiToken: string): TodoistApiClient {
        return new TodoistApi(apiToken);
    }
}
