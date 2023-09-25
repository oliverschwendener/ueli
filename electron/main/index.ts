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
import { usePluginManager } from "./PluginManager";
import { usePlugins, type PluginDependencies } from "./Plugins";
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
    const searchIndex = useSearchIndex({ eventEmitter, eventSubscriber });
    const executor = useExecutor({ commandlineUtility, eventEmitter, shell });
    const { plugins, pluginIdsEnabledByDefault } = usePlugins();

    const pluginDependencies: PluginDependencies = {
        app,
        commandlineUtility,
        eventSubscriber,
        fileSystemUtility,
        operatingSystem,
        pluginCacheFolderPath: await usePluginCacheFolder({ app, fileSystemUtility }),
        searchIndex,
        settingsManager,
    };

    const pluginManager = usePluginManager({
        eventSubscriber,
        operatingSystem,
        pluginDependencies,
        pluginIdsEnabledByDefault,
        plugins,
        settingsManager,
    });

    await useBrowserWindow({
        app,
        eventSubscriber,
        nativeTheme,
        operatingSystem,
        settingsManager,
    });

    useIpcMain({
        eventEmitter,
        executor,
        ipcMain,
        nativeTheme,
        pluginManager,
        searchIndex,
        settingsManager,
    });
})();
