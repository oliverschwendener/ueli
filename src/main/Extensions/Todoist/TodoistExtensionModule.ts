import type { Image } from "@common/Core/Image";
import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import {
    TodoistActionManager,
    TodoistOpenTaskActionHandler,
    TodoistQuickAddActionHandler,
    TodoistRefreshCachesActionHandler,
    TodoistSetSearchTermActionHandler,
} from "./Actions";
import { TodoistCacheManager } from "./Caching";
import { TodoistQuickAddProvider, TodoistTaskListProvider } from "./Search";
import { DefaultTodoistApiFactory } from "./Shared";
import { TodoistExtension } from "./TodoistExtension";

const TodoistExtensionId = "Todoist";

export class TodoistExtensionModule implements ExtensionModule {
    public bootstrap(moduleRegistry: UeliModuleRegistry): ExtensionBootstrapResult {
        const assetPathResolver = moduleRegistry.get("AssetPathResolver");
        const settingsManager = moduleRegistry.get("SettingsManager");
        const translator = moduleRegistry.get("Translator");
        const taskScheduler = moduleRegistry.get("TaskScheduler");
        const logger = moduleRegistry.get("Logger");
        const browserWindowRegistry = moduleRegistry.get("BrowserWindowRegistry");
        const browserWindowNotifier = moduleRegistry.get("BrowserWindowNotifier");
        const notification = moduleRegistry.get("Notification");
        const shell = moduleRegistry.get("Shell");
        const todoistApiFactory = new DefaultTodoistApiFactory();

        const image: Image = {
            url: `file://${assetPathResolver.getExtensionAssetPath(TodoistExtensionId, "todoist.svg")}`,
        };

        const cacheManager = new TodoistCacheManager(settingsManager, taskScheduler, todoistApiFactory, logger);

        const actionManager = new TodoistActionManager(
            todoistApiFactory,
            settingsManager,
            translator,
            notification,
            browserWindowRegistry,
            logger,
            shell,
            cacheManager,
            browserWindowNotifier,
        );

        const quickAddProvider = new TodoistQuickAddProvider(cacheManager, settingsManager, translator, image);
        const taskListProvider = new TodoistTaskListProvider(
            cacheManager,
            settingsManager,
            translator,
            image,
            actionManager,
        );

        const extension = new TodoistExtension(image, cacheManager, quickAddProvider, taskListProvider);

        return {
            extension,
            actionHandlers: [
                new TodoistQuickAddActionHandler(actionManager),
                new TodoistSetSearchTermActionHandler(browserWindowNotifier),
                new TodoistOpenTaskActionHandler(actionManager),
                new TodoistRefreshCachesActionHandler(actionManager, logger),
            ],
        };
    }
}
