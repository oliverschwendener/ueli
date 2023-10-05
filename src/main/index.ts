import type { PluginDependencies } from "@common/PluginDependencies";
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
import { usePlugins } from "./Plugins";
import { useSearchIndex } from "./SearchIndex";
import { useSettingsManager } from "./SettingsManager";
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

    useNativeTheme({ ipcMain, nativeTheme });

    const pluginDependencies: PluginDependencies = {
        app,
        commandlineUtility,
        currentOperatingSystem,
        eventSubscriber,
        fileSystemUtility,
        nativeTheme,
        pluginCacheFolderPath: await usePluginCacheFolder({ app, fileSystemUtility }),
        settingsManager,
    };

    usePlugins({
        ipcMain,
        pluginDependencies,
        searchIndex,
    });

    useExecutor({
        commandlineUtility,
        eventEmitter,
        ipcMain,
        shell,
    });

    await useBrowserWindow({
        app,
        currentOperatingSystem,
        eventSubscriber,
        nativeTheme,
        settingsManager,
    });
})();
