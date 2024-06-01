import { Workflow } from "./Workflow";
import { ExecuteCommandWorkflowAction } from "./WorkflowAction/ExecuteCommandWorkflowAction";
import { OpenFileWorkflowAction } from "./WorkflowAction/OpenFileWorkflowAction";
import { OpenUrlWorkflowAction } from "./WorkflowAction/OpenUrlWorkflowAction";

export class WorkflowRepository {
    public async getAll(): Promise<Workflow[]> {
        return [
            new Workflow("workflow:1234", "Start coding", [
                new OpenFileWorkflowAction("shell:AppsFolder\\SpotifyAB.SpotifyMusic_zpdnekdrzrea0!Spotify"),
                new OpenUrlWorkflowAction("https://github.com/oliverschwendener/ueli"),
                new ExecuteCommandWorkflowAction("code C:\\Users\\Oliver\\projects\\electron-fluent-ui"),
            ]),
        ];
    }
}
