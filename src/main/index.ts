import * as Electron from "electron";
import mitt from "mitt";
import { platform } from "os";
import * as Core from "./Core";
import * as Extensions from "./Extensions";

(async () => {
    await Electron.app.whenReady();

    Core.SingleInstanceLockModule.bootstrap(Electron.app);

    const dependencyRegistry = Core.DependencyRegistryModule.bootstrap();

    // Electron Modules
    dependencyRegistry.register("App", Electron.app);
    dependencyRegistry.register("Clipboard", Electron.clipboard);
    dependencyRegistry.register("Dialog", Electron.dialog);
    dependencyRegistry.register("Emitter", mitt<Record<string, unknown>>());
    dependencyRegistry.register("GlobalShortcut", Electron.globalShortcut);
    dependencyRegistry.register("IpcMain", Electron.ipcMain);
    dependencyRegistry.register("NativeTheme", Electron.nativeTheme);
    dependencyRegistry.register("Net", Electron.net);
    dependencyRegistry.register("Platform", platform());
    dependencyRegistry.register("SafeStorage", Electron.safeStorage);
    dependencyRegistry.register("Screen", Electron.screen);
    dependencyRegistry.register("Shell", Electron.shell);
    dependencyRegistry.register("SystemPreferences", Electron.systemPreferences);

    // Core Modules
    Core.OperatingSystemModule.bootstrap(dependencyRegistry);
    Core.CommandlineSwitchModule.bootstrap(dependencyRegistry);
    Core.TaskSchedulerModule.bootstrap(dependencyRegistry);
    Core.EnvironmentVariableProviderModule.bootstrap(dependencyRegistry);
    Core.LinuxDesktopEnvironmentModule.bootstrap(dependencyRegistry);
    Core.IniFileParserModule.bootstrap(dependencyRegistry);
    Core.XmlParserModule.bootstrap(dependencyRegistry);
    Core.EventEmitterModule.bootstrap(dependencyRegistry);
    Core.EventSubscriberModule.bootstrap(dependencyRegistry);
    Core.BrowserWindowNotifierModule.bootstrap(dependencyRegistry);
    Core.DateProviderModule.bootstrap(dependencyRegistry);
    Core.LoggerModule.bootstrap(dependencyRegistry);
    Core.ActionHandlerModule.bootstrap(dependencyRegistry);
    Core.RandomStringProviderModule.bootstrap(dependencyRegistry);
    Core.SafeStorageEncryptionModule.bootstrap(dependencyRegistry);
    Core.AssetPathResolverModule.bootstrap(dependencyRegistry);
    Core.ShellModule.bootstrap(dependencyRegistry);
    Core.ClipboardModule.bootstrap(dependencyRegistry);
    Core.AboutUeliModule.bootstrap(dependencyRegistry);
    Core.CommandlineUtilityModule.bootstrap(dependencyRegistry);
    Core.AppleScriptUtilityModule.bootstrap(dependencyRegistry);
    Core.FileSystemUtilityModule.bootstrap(dependencyRegistry);
    await Core.PowershellUtilityModule.bootstrap(dependencyRegistry);
    Core.SettingsFileModule.bootstrap(dependencyRegistry);
    Core.SettingsReaderModule.bootstrap(dependencyRegistry);
    Core.SettingsWriterModule.bootstrap(dependencyRegistry);
    Core.SettingsManagerModule.bootstrap(dependencyRegistry);
    Core.DockModule.bootstrap(dependencyRegistry);
    await Core.ImageGeneratorModule.bootstrap(dependencyRegistry);
    Core.TranslatorModule.bootstrap(dependencyRegistry);
    Core.SearchIndexModule.bootstrap(dependencyRegistry);
    Core.NativeThemeModule.bootstrap(dependencyRegistry);
    Core.GlobalShortcutModule.bootstrap(dependencyRegistry);
    Core.AutostartModule.bootstrap(dependencyRegistry);
    Core.ExcludedSearchResultsModule.bootstrap(dependencyRegistry);
    Core.FavoriteManagerModule.bootstrap(dependencyRegistry);
    Core.UeliCommandModule.bootstrap(dependencyRegistry);
    await Core.TrayIconModule.bootstrap(dependencyRegistry);
    Core.DialogModule.bootstrap(dependencyRegistry);
    Core.TerminalModule.bootstrap(dependencyRegistry);
    Core.ExtensionRegistryModule.bootstrap(dependencyRegistry);

    // Extensions
    Extensions.ExtensionLoader.bootstrap(dependencyRegistry);
    await Core.ExtensionManagerModule.bootstrap(dependencyRegistry);

    // BrowserWindow
    await Core.BrowserWindowModule.bootstrap(dependencyRegistry);

    Core.RescanOrchestratorModule.bootstrap(dependencyRegistry);
})();
