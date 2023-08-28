import { app, ipcMain, nativeTheme } from "electron";
import mitt from "mitt";
import { platform } from "process";
import { useBrowserWindow } from "./BrowserWindow";
import { useEventEmitter, useEventSubscriber } from "./EventEmitter";
import { useIpcMain } from "./IpcMain";
import { useOperatingSystem } from "./OperatingSystem";
import { usePlugins } from "./Plugins";
import { useSearchIndex } from "./SearchIndex";
import { useSettingsManager } from "./Settings";

(async () => {
    await app.whenReady();

    const operatingSystem = useOperatingSystem({ platform });
    const settingsManager = useSettingsManager({ app });
    const emitter = mitt<Record<string, unknown>>();
    const eventEmitter = useEventEmitter({ emitter });
    const eventSubscriber = useEventSubscriber({ emitter });
    const searchIndex = useSearchIndex({ eventEmitter });
    const plugins = usePlugins({ app, operatingSystem, searchIndex, settingsManager });

    await useBrowserWindow({ app, operatingSystem, eventSubscriber, nativeTheme });

    useIpcMain({ ipcMain, nativeTheme, searchIndex, settingsManager });

    for (const plugin of plugins) {
        plugin.addSearchResultItemsToSearchIndex();
    }
})();
