import {
    app,
    globalShortcut,
    ipcMain,
    nativeTheme,
    shell,
    type App,
    type GlobalShortcut,
    type IpcMain,
    type NativeTheme,
    type Shell,
} from "electron";
import mitt, { Emitter } from "mitt";
import { platform } from "os";
import { useBrowserWindow } from "./BrowserWindow";
import { useBrowserWindowToggler } from "./BrowserWindow/useBrowserWindowToggler";
import { DependencyInjector } from "./DependencyInjector";
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
import { useSettingsFile } from "./SettingsFile";
import { useSettingsManager } from "./SettingsManager";
import { useSettingsReader } from "./SettingsReader";
import { useSettingsWriter } from "./SettingsWriter";
import { useUtilities } from "./Utilities";

(async () => {
    await app.whenReady();

    app.dock?.hide();

    const dependencyInjector = new DependencyInjector();

    dependencyInjector.registerInstance<string>("Platform", platform());
    dependencyInjector.registerInstance<App>("App", app);
    dependencyInjector.registerInstance<IpcMain>("IpcMain", ipcMain);
    dependencyInjector.registerInstance<NativeTheme>("NativeTheme", nativeTheme);
    dependencyInjector.registerInstance<Shell>("Shell", shell);
    dependencyInjector.registerInstance<GlobalShortcut>("GlobalShortcut", globalShortcut);
    dependencyInjector.registerInstance<Emitter<Record<string, unknown>>>("Emitter", mitt<Record<string, unknown>>());

    useUtilities(dependencyInjector);
    useCurrentOperatingSystem(dependencyInjector);
    useSettingsFile(dependencyInjector);
    useSettingsReader(dependencyInjector);
    useSettingsWriter(dependencyInjector);
    useSettingsManager(dependencyInjector);
    useSettingsEventSubscriber(dependencyInjector);
    useEventEmitter(dependencyInjector);
    useEventSubscriber(dependencyInjector);
    useSearchIndex(dependencyInjector);
    useNativeTheme(dependencyInjector);

    await usePluginCacheFolder(dependencyInjector);

    usePlugins(dependencyInjector);
    useExecutor(dependencyInjector);

    await useBrowserWindow(dependencyInjector);

    useBrowserWindowToggler(dependencyInjector);
    useGlobalShortcut(dependencyInjector);
})();
