import * as Electron from "electron";
import mitt, { Emitter } from "mitt";
import { platform } from "os";
import * as Core from "./Core";
import { ExtensionsModule } from "./Extensions";

(async () => {
    await Electron.app.whenReady();

    Electron.app.dock?.hide();

    const dependencyInjector = Core.DependencyInjectorModule.bootstrap();

    // Electron Modules
    dependencyInjector.registerInstance<string>("Platform", platform());
    dependencyInjector.registerInstance<Electron.App>("App", Electron.app);
    dependencyInjector.registerInstance<Electron.IpcMain>("IpcMain", Electron.ipcMain);
    dependencyInjector.registerInstance<Electron.NativeTheme>("NativeTheme", Electron.nativeTheme);
    dependencyInjector.registerInstance<Electron.Shell>("Shell", Electron.shell);
    dependencyInjector.registerInstance<Electron.GlobalShortcut>("GlobalShortcut", Electron.globalShortcut);
    dependencyInjector.registerInstance<Emitter<Record<string, unknown>>>("Emitter", mitt<Record<string, unknown>>());
    dependencyInjector.registerInstance<Electron.SystemPreferences>("SystemPreferences", Electron.systemPreferences);
    dependencyInjector.registerInstance<Electron.Dialog>("Dialog", Electron.dialog);
    dependencyInjector.registerInstance<Electron.Clipboard>("Clipboard", Electron.clipboard);
    dependencyInjector.registerInstance<Electron.Net>("Net", Electron.net);
    dependencyInjector.registerInstance<Electron.SafeStorage>("SafeStorage", Electron.safeStorage);

    // Core Modules
    Core.SafeStorageEncryptionModule.bootstrap(dependencyInjector);
    Core.ShellModule.bootstrap(dependencyInjector);
    Core.ClipboardModule.bootstrap(dependencyInjector);
    Core.ClockModule.bootstrap(dependencyInjector);
    Core.AboutUeliModule.bootstrap(dependencyInjector);
    Core.LoggerModule.bootstrap(dependencyInjector);
    Core.EventEmitterModule.bootstrap(dependencyInjector);
    Core.EventSubscriberModule.bootstrap(dependencyInjector);
    Core.CommandlineUtilityModule.bootstrap(dependencyInjector);
    Core.FileSystemUtilityModule.bootstrap(dependencyInjector);
    Core.OperatingSystemModule.bootstrap(dependencyInjector);
    Core.SettingsFileModule.bootstrap(dependencyInjector);
    Core.SettingsReaderModule.bootstrap(dependencyInjector);
    Core.SettingsWriterModule.bootstrap(dependencyInjector);
    Core.SettingsManagerModule.bootstrap(dependencyInjector);
    Core.SearchIndexModule.bootstrap(dependencyInjector);
    Core.NativeThemeModule.bootstrap(dependencyInjector);
    await Core.BrowserWindowModule.bootstrap(dependencyInjector);
    Core.GlobalShortcutModule.bootstrap(dependencyInjector);
    Core.ActionHandlerModule.bootstrap(dependencyInjector);
    Core.UeliCommandModule.bootstrap(dependencyInjector);
    Core.TrayIconModule.bootstrap(dependencyInjector);
    Core.DialogModule.bootstrap(dependencyInjector);
    Core.ExtensionAssetsModule.bootstrap(dependencyInjector);
    await Core.ExtensionCacheFolderModule.bootstrap(dependencyInjector);

    // Extensions
    ExtensionsModule.bootstrap(dependencyInjector);
    Core.ExtensionManagerModule.bootstrap(dependencyInjector);
})();
