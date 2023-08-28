import { app, ipcMain, nativeTheme } from "electron";
import mitt from "mitt";
import { platform } from "process";
import { useBrowserWindow } from "./BrowserWindow";
import { useEventEmitter, useEventSubscriber } from "./EventEmitter";
import { useIpcMain } from "./IpcMain";
import { useOperatingSystem } from "./OperatingSystem";
import { usePluginCacheFolder } from "./PluginCacheFolder";
import { usePlugins } from "./Plugins";
import { useSearchIndex } from "./SearchIndex";
import { useSettingsManager } from "./Settings";
import { useUtilities } from "./Utilities";

(async () => {
    await app.whenReady();

    const { commandlineUtility, powershellUtility, fileSystemUtility } = useUtilities();

    const operatingSystem = useOperatingSystem({ platform });
    const settingsManager = useSettingsManager({ app });
    const emitter = mitt<Record<string, unknown>>();
    const eventEmitter = useEventEmitter({ emitter });
    const eventSubscriber = useEventSubscriber({ emitter });
    const searchIndex = useSearchIndex({ eventEmitter });
    const pluginCacheFolderPath = usePluginCacheFolder({ app, fileSystemUtility });

    const plugins = usePlugins({
        app,
        commandlineUtility,
        fileSystemUtility,
        operatingSystem,
        pluginCacheFolderPath,
        powershellUtility,
        searchIndex,
        settingsManager,
    });

    await useBrowserWindow({ app, operatingSystem, eventSubscriber, nativeTheme });

    useIpcMain({ ipcMain, nativeTheme, searchIndex, settingsManager });

    for (const plugin of plugins) {
        plugin.addSearchResultItemsToSearchIndex();
    }
})();
