import type { PluginDependencies } from "@common/PluginDependencies";
import { app, globalShortcut, ipcMain, nativeTheme, shell } from "electron";
import mitt from "mitt";
import { platform } from "process";
import { useBrowserWindow } from "./BrowserWindow";
import { useBrowserWindowToggler } from "./BrowserWindow/useBrowserWindowToggler";
import { useEventEmitter } from "./EventEmitter";
import { useEventSubscriber } from "./EventSubscriber";
import { useExecutor } from "./Executor";
import { useGlobalShortcut } from "./GlobalShortcut";
import { useNativeTheme } from "./NativeTheme";
import { useCurrentOperatingSystem } from "./OperatingSystem";
import { usePluginCacheFolder } from "./PluginCacheFolder";
import { usePlugins } from "./Plugins";
import { useSearchIndex } from "./SearchIndex";
import { useSettingsEventSubscriber } from "./SettingsEventSubscriber";
import { useSettingsFilePath } from "./SettingsFile";
import { useSettingsManager } from "./SettingsManager";
import { useSettingsReader } from "./SettingsReader";
import { useSettingsWriter } from "./SettingsWriter";
import { useUtilities } from "./Utilities";

(async () => {
    await app.whenReady();

    app.dock?.hide();

    const { commandlineUtility, fileSystemUtility } = useUtilities();
    const currentOperatingSystem = useCurrentOperatingSystem({ platform });

    const settingsFilePath = useSettingsFilePath({ app });
    const settingsReader = useSettingsReader(settingsFilePath);
    const settingsWriter = useSettingsWriter(settingsFilePath);
    const settingsManager = useSettingsManager({ settingsReader, settingsWriter });
    useSettingsEventSubscriber({ settingsManager, ipcMain });

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

    usePlugins({ ipcMain, pluginDependencies, searchIndex });

    useExecutor({
        commandlineUtility,
        eventEmitter,
        ipcMain,
        shell,
    });

    const browserWindow = await useBrowserWindow({
        app,
        currentOperatingSystem,
        eventSubscriber,
        nativeTheme,
        settingsManager,
    });

    const browserWindowToggler = useBrowserWindowToggler({ app, browserWindow });

    useGlobalShortcut({ globalShortcut, browserWindowToggler });
})();
