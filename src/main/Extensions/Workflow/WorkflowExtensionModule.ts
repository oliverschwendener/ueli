import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { WorkflowAction } from "./WorkflowAction";
import type { WorkflowActionHandler } from "./WorkflowActionHandler";
import {
    ExecuteCommandWorkflowActionHandler,
    OpenFileWorkflowActionHandler,
    OpenUrlWorkflowActionHandler,
} from "./WorkflowActionHandler";
import { WorkflowExtension } from "./WorkflowExtension";
import { WorkflowHandler } from "./WorkflowHandler";
import { WorkflowRepository } from "./WorkflowRepository";

export class WorkflowExtensionModule implements ExtensionModule {
    public bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>): ExtensionBootstrapResult {
        const workflowActionHandlers: Record<string, WorkflowActionHandler<WorkflowAction>> = {
            OpenFile: new OpenFileWorkflowActionHandler(dependencyRegistry.get("Shell")),
            OpenUrl: new OpenUrlWorkflowActionHandler(dependencyRegistry.get("Shell")),
            ExecuteCommand: new ExecuteCommandWorkflowActionHandler(dependencyRegistry.get("CommandlineUtility")),
        };

        return {
            extension: new WorkflowExtension(dependencyRegistry.get("AssetPathResolver"), new WorkflowRepository()),
            actionHandlers: [new WorkflowHandler(dependencyRegistry.get("Logger"), workflowActionHandlers)],
        };
    }
}
