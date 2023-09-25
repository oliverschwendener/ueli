import { app, ipcMain, nativeTheme, shell } from "electron";
import mitt from "mitt";
import { platform } from "process";
import { useBrowserWindow } from "./BrowserWindow";
import { useEventEmitter } from "./EventEmitter";
import { useEventSubscriber } from "./EventSubscriber";
import { useExecutor } from "./Executor";
import { useNativeTheme } from "./NativeTheme";
import { useCurrentOperatingSystem } from "./OperatingSystem";
import { usePluginCacheFolder } from "./PluginCacheFolder";
import { usePluginManager } from "./PluginManager";
import { usePlugins, type PluginDependencies } from "./Plugins";
import { useSearchIndex } from "./SearchIndex";
import { useSettingsManager } from "./Settings";
import { useUtilities } from "./Utilities";

(async () => {
    await app.whenReady();

    const { commandlineUtility, fileSystemUtility } = useUtilities();
    const currentOperatingSystem = useCurrentOperatingSystem({ platform });
    const settingsManager = useSettingsManager({ app, ipcMain });
    const emitter = mitt<Record<string, unknown>>();
    const eventEmitter = useEventEmitter({ emitter });
    const eventSubscriber = useEventSubscriber({ emitter });
    const searchIndex = useSearchIndex({ eventEmitter, ipcMain });
    const { plugins, pluginIdsEnabledByDefault } = usePlugins();

    useExecutor({
        commandlineUtility,
        eventEmitter,
        ipcMain,
        shell,
    });

    const pluginDependencies: PluginDependencies = {
        app,
        commandlineUtility,
        eventSubscriber,
        fileSystemUtility,
        currentOperatingSystem,
        pluginCacheFolderPath: await usePluginCacheFolder({ app, fileSystemUtility }),
        searchIndex,
        settingsManager,
    };

    usePluginManager({
        ipcMain,
        currentOperatingSystem,
        pluginDependencies,
        pluginIdsEnabledByDefault,
        plugins,
        settingsManager,
    });

    await useBrowserWindow({
        app,
        eventSubscriber,
        nativeTheme,
        operatingSystem: currentOperatingSystem,
        settingsManager,
    });

    useNativeTheme({
        ipcMain,
        nativeTheme,
    });
})();
