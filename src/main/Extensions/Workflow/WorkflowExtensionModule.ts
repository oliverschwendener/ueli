import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import type { WorkflowActionHandler } from "./WorkflowActionHandler";
import {
    ExecuteCommandWorkflowActionHandler,
    OpenFileWorkflowActionHandler,
    OpenTerminalWorkflowActionHandler,
    OpenUrlWorkflowActionHandler,
} from "./WorkflowActionHandler";
import { WorkflowExtension } from "./WorkflowExtension";
import { WorkflowHandler } from "./WorkflowHandler";
import { WorkflowRepository } from "./WorkflowRepository";

export class WorkflowExtensionModule implements ExtensionModule {
    public bootstrap(moduleRegistry: UeliModuleRegistry): ExtensionBootstrapResult {
        const workflowActionHandlers: Record<string, WorkflowActionHandler> = {
            OpenFile: new OpenFileWorkflowActionHandler(moduleRegistry.get("Shell")),
            OpenUrl: new OpenUrlWorkflowActionHandler(moduleRegistry.get("Shell")),
            OpenTerminal: new OpenTerminalWorkflowActionHandler(moduleRegistry.get("TerminalRegistry")),
            ExecuteCommand: new ExecuteCommandWorkflowActionHandler(moduleRegistry.get("CommandlineUtility")),
        };

        return {
            extension: new WorkflowExtension(
                moduleRegistry.get("AssetPathResolver"),
                new WorkflowRepository(moduleRegistry.get("SettingsManager")),
                moduleRegistry.get("Translator"),
            ),
            actionHandlers: [new WorkflowHandler(moduleRegistry.get("Logger"), workflowActionHandlers)],
        };
    }
}
