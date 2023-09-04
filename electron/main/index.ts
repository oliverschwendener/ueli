import { app, ipcMain, nativeTheme, shell } from "electron";
import mitt from "mitt";
import { platform } from "process";
import { useBrowserWindow } from "./BrowserWindow";
import { useEventEmitter } from "./EventEmitter";
import { useEventSubscriber } from "./EventSubscriber";
import { useExecutor } from "./Executor";
import { useIpcMain } from "./IpcMain";
import { useOperatingSystem } from "./OperatingSystem";
import { usePluginCacheFolder } from "./PluginCacheFolder";
import { usePlugins } from "./Plugins";
import { useSearchIndex } from "./SearchIndex";
import { useSettingsManager } from "./Settings";
import { useUtilities } from "./Utilities";

(async () => {
    await app.whenReady();

    const { commandlineUtility, fileSystemUtility } = useUtilities();
    const operatingSystem = useOperatingSystem({ platform });
    const settingsManager = useSettingsManager({ app });
    const emitter = mitt<Record<string, unknown>>();
    const eventEmitter = useEventEmitter({ emitter });
    const eventSubscriber = useEventSubscriber({ emitter });
    const searchIndex = useSearchIndex({ eventEmitter });
    const executor = useExecutor({ shell, eventEmitter });

    await useBrowserWindow({ app, operatingSystem, eventSubscriber, nativeTheme });

    useIpcMain({
        executor,
        ipcMain,
        nativeTheme,
        searchIndex,
        settingsManager,
    });

    const pluginCacheFolderPath = await usePluginCacheFolder({ app, fileSystemUtility });

    for (const plugin of usePlugins({
        app,
        commandlineUtility,
        fileSystemUtility,
        operatingSystem,
        pluginCacheFolderPath,
        searchIndex,
        settingsManager,
    })) {
        plugin.addSearchResultItemsToSearchIndex();
    }
})();
