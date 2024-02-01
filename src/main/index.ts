import * as Electron from "electron";
import mitt from "mitt";
import { platform } from "os";
import * as Core from "./Core";
import * as Extensions from "./Extensions";

(async () => {
    await Electron.app.whenReady();

    Electron.app.dock?.hide();

    const dependencyRegistry = Core.DependencyRegistryModule.bootstrap();

    // Electron Modules
    dependencyRegistry.register("Platform", platform());
    dependencyRegistry.register("App", Electron.app);
    dependencyRegistry.register("IpcMain", Electron.ipcMain);
    dependencyRegistry.register("NativeTheme", Electron.nativeTheme);
    dependencyRegistry.register("Shell", Electron.shell);
    dependencyRegistry.register("GlobalShortcut", Electron.globalShortcut);
    dependencyRegistry.register("Emitter", mitt<Record<string, unknown>>());
    dependencyRegistry.register("SystemPreferences", Electron.systemPreferences);
    dependencyRegistry.register("Dialog", Electron.dialog);
    dependencyRegistry.register("Clipboard", Electron.clipboard);
    dependencyRegistry.register("Net", Electron.net);
    dependencyRegistry.register("SafeStorage", Electron.safeStorage);

    // Core Modules
    Core.RandomStringProviderModule.bootstrap(dependencyRegistry);
    Core.SafeStorageEncryptionModule.bootstrap(dependencyRegistry);
    Core.AssetPathResolverModule.bootstrap(dependencyRegistry);
    Core.ShellModule.bootstrap(dependencyRegistry);
    Core.ClipboardModule.bootstrap(dependencyRegistry);
    Core.ClockModule.bootstrap(dependencyRegistry);
    Core.AboutUeliModule.bootstrap(dependencyRegistry);
    Core.LoggerModule.bootstrap(dependencyRegistry);
    Core.EventEmitterModule.bootstrap(dependencyRegistry);
    Core.EventSubscriberModule.bootstrap(dependencyRegistry);
    Core.CommandlineUtilityModule.bootstrap(dependencyRegistry);
    Core.FileSystemUtilityModule.bootstrap(dependencyRegistry);
    await Core.PowershellUtilityModule.bootstrap(dependencyRegistry);
    Core.OperatingSystemModule.bootstrap(dependencyRegistry);
    Core.SettingsFileModule.bootstrap(dependencyRegistry);
    Core.SettingsReaderModule.bootstrap(dependencyRegistry);
    Core.SettingsWriterModule.bootstrap(dependencyRegistry);
    Core.SettingsManagerModule.bootstrap(dependencyRegistry);
    Core.TranslatorModule.bootstrap(dependencyRegistry);
    Core.SearchIndexModule.bootstrap(dependencyRegistry);
    Core.NativeThemeModule.bootstrap(dependencyRegistry);
    await Core.BrowserWindowModule.bootstrap(dependencyRegistry);
    Core.GlobalShortcutModule.bootstrap(dependencyRegistry);
    Core.AutostartModule.bootstrap(dependencyRegistry);
    Core.ExcludedSearchResultsModule.bootstrap(dependencyRegistry);
    Core.ActionHandlerModule.bootstrap(dependencyRegistry);
    Core.UeliCommandModule.bootstrap(dependencyRegistry);
    await Core.TrayIconModule.bootstrap(dependencyRegistry);
    Core.DialogModule.bootstrap(dependencyRegistry);
    await Core.ExtensionCacheFolderModule.bootstrap(dependencyRegistry);
    Core.ExtensionRegistryModule.bootstrap(dependencyRegistry);

    // Extensions
    Extensions.ExtensionLoader.bootstrap(dependencyRegistry);
    await Core.ExtensionManagerModule.bootstrap(dependencyRegistry);
})();
