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
import { ActionInvokerModule } from "./ActionInvoker";
import { BrowserWindowModule } from "./BrowserWindow";
import { BrowserWindowTogglerModule } from "./BrowserWindowToggler";
import { CommandlineUtilityModule } from "./CommandlineUtility";
import { DependencyInjector } from "./DependencyInjector";
import { EventEmitterModule } from "./EventEmitter";
import { EventSubscriberModule } from "./EventSubscriber";
import { FileSystemUtilityModule } from "./FileSystemUtility";
import { GlobalShortcutModule } from "./GlobalShortcut";
import { NativeThemeModule } from "./NativeTheme";
import { OperatingSystemModule } from "./OperatingSystem";
import { PluginCacheFolderModule } from "./PluginCacheFolder";
import { PluginManagerModule } from "./PluginManager";
import { PluginModule } from "./Plugins";
import { SearchIndexModule } from "./SearchIndex";
import { SettingsFileModule } from "./SettingsFile";
import { SettingsManagerModule } from "./SettingsManager";
import { SettingsReaderModule } from "./SettingsReader";
import { SettingsWriterModule } from "./SettingsWriter";

(async () => {
    await app.whenReady();

    app.dock?.hide();

    const dependencyInjector = new DependencyInjector();

    // Electron Modules
    dependencyInjector.registerInstance<string>("Platform", platform());
    dependencyInjector.registerInstance<App>("App", app);
    dependencyInjector.registerInstance<IpcMain>("IpcMain", ipcMain);
    dependencyInjector.registerInstance<NativeTheme>("NativeTheme", nativeTheme);
    dependencyInjector.registerInstance<Shell>("Shell", shell);
    dependencyInjector.registerInstance<GlobalShortcut>("GlobalShortcut", globalShortcut);
    dependencyInjector.registerInstance<Emitter<Record<string, unknown>>>("Emitter", mitt<Record<string, unknown>>());

    // Ueli Modules
    CommandlineUtilityModule.bootstrap(dependencyInjector);
    FileSystemUtilityModule.bootstrap(dependencyInjector);
    OperatingSystemModule.bootstrap(dependencyInjector);
    SettingsFileModule.bootstrap(dependencyInjector);
    SettingsReaderModule.bootstrap(dependencyInjector);
    SettingsWriterModule.bootstrap(dependencyInjector);
    SettingsManagerModule.bootstrap(dependencyInjector);
    EventEmitterModule.bootstrap(dependencyInjector);
    EventSubscriberModule.bootstrap(dependencyInjector);
    SearchIndexModule.bootstrap(dependencyInjector);
    NativeThemeModule.bootstrap(dependencyInjector);
    await BrowserWindowModule.bootstrap(dependencyInjector);
    BrowserWindowTogglerModule.bootstrap(dependencyInjector);
    GlobalShortcutModule.bootstrap(dependencyInjector);
    ActionInvokerModule.bootstrap(dependencyInjector);

    // Plugin MOdules
    await PluginCacheFolderModule.bootstrap(dependencyInjector);
    PluginModule.bootstrap(dependencyInjector);
    PluginManagerModule.bootstrap(dependencyInjector);
})();
