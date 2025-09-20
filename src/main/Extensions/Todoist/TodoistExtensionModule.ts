import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { DefaultTodoistApiFactory } from "./TodoistApiFactory";
import { TodoistExtension } from "./TodoistExtension";
import { ElectronNotificationPresenter } from "./TodoistNotificationPresenter";
import { TodoistQuickAddActionHandler } from "./TodoistQuickAddActionHandler";
import { TodoistSetSearchTermActionHandler } from "./TodoistSetSearchTermActionHandler";

export class TodoistExtensionModule implements ExtensionModule {
    public bootstrap(moduleRegistry: UeliModuleRegistry): ExtensionBootstrapResult {
        const assetPathResolver = moduleRegistry.get("AssetPathResolver");
        const settingsManager = moduleRegistry.get("SettingsManager");
        const translator = moduleRegistry.get("Translator");
        const taskScheduler = moduleRegistry.get("TaskScheduler");
        const logger = moduleRegistry.get("Logger");
        const browserWindowRegistry = moduleRegistry.get("BrowserWindowRegistry");
        const browserWindowNotifier = moduleRegistry.get("BrowserWindowNotifier");
        const todoistApiFactory = new DefaultTodoistApiFactory();

        const extension = new TodoistExtension(
            assetPathResolver,
            settingsManager,
            translator,
            taskScheduler,
            todoistApiFactory,
            logger,
        );

        return {
            extension,
            actionHandlers: [
                new TodoistQuickAddActionHandler(
                    todoistApiFactory,
                    settingsManager,
                    translator,
                    new ElectronNotificationPresenter(),
                    browserWindowRegistry,
                    logger,
                ),
                new TodoistSetSearchTermActionHandler(browserWindowNotifier),
            ],
        };
    }
}
