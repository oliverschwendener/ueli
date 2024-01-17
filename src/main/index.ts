import * as Electron from "electron";
import mitt from "mitt";
import { platform } from "os";
import * as Core from "./Core";
import * as Extensions from "./Extensions";

(async () => {
    await Electron.app.whenReady();

    Electron.app.dock?.hide();

    const dependencyInjector = Core.DependencyInjectorModule.bootstrap();

    // Electron Modules
    dependencyInjector.registerInstance("Platform", platform());
    dependencyInjector.registerInstance("App", Electron.app);
    dependencyInjector.registerInstance("IpcMain", Electron.ipcMain);
    dependencyInjector.registerInstance("NativeTheme", Electron.nativeTheme);
    dependencyInjector.registerInstance("Shell", Electron.shell);
    dependencyInjector.registerInstance("GlobalShortcut", Electron.globalShortcut);
    dependencyInjector.registerInstance("Emitter", mitt<Record<string, unknown>>());
    dependencyInjector.registerInstance("SystemPreferences", Electron.systemPreferences);
    dependencyInjector.registerInstance("Dialog", Electron.dialog);
    dependencyInjector.registerInstance("Clipboard", Electron.clipboard);
    dependencyInjector.registerInstance("Net", Electron.net);
    dependencyInjector.registerInstance("SafeStorage", Electron.safeStorage);

    // Core Modules
    Core.RandomStringProviderModule.bootstrap(dependencyInjector);
    Core.SafeStorageEncryptionModule.bootstrap(dependencyInjector);
    Core.AssetPathResolverModule.bootstrap(dependencyInjector);
    Core.ShellModule.bootstrap(dependencyInjector);
    Core.ClipboardModule.bootstrap(dependencyInjector);
    Core.ClockModule.bootstrap(dependencyInjector);
    Core.AboutUeliModule.bootstrap(dependencyInjector);
    Core.LoggerModule.bootstrap(dependencyInjector);
    Core.EventEmitterModule.bootstrap(dependencyInjector);
    Core.EventSubscriberModule.bootstrap(dependencyInjector);
    Core.CommandlineUtilityModule.bootstrap(dependencyInjector);
    Core.FileSystemUtilityModule.bootstrap(dependencyInjector);
    await Core.PowershellUtilityModule.bootstrap(dependencyInjector);
    Core.OperatingSystemModule.bootstrap(dependencyInjector);
    Core.SettingsFileModule.bootstrap(dependencyInjector);
    Core.SettingsReaderModule.bootstrap(dependencyInjector);
    Core.SettingsWriterModule.bootstrap(dependencyInjector);
    Core.SettingsManagerModule.bootstrap(dependencyInjector);
    Core.TranslatorModule.bootstrap(dependencyInjector);
    Core.SearchIndexModule.bootstrap(dependencyInjector);
    Core.NativeThemeModule.bootstrap(dependencyInjector);
    await Core.BrowserWindowModule.bootstrap(dependencyInjector);
    Core.GlobalShortcutModule.bootstrap(dependencyInjector);
    Core.ActionHandlerModule.bootstrap(dependencyInjector);
    Core.UeliCommandModule.bootstrap(dependencyInjector);
    Core.TrayIconModule.bootstrap(dependencyInjector);
    Core.DialogModule.bootstrap(dependencyInjector);
    await Core.ExtensionCacheFolderModule.bootstrap(dependencyInjector);
    Core.ExtensionRegsitryModule.bootstrap(dependencyInjector);

    // Extensions
    Extensions.ExtensionLoader.bootstrap(dependencyInjector);
    await Core.ExtensionManagerModule.bootstrap(dependencyInjector);
})();
