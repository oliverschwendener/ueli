import { app } from "electron";

if (!app.requestSingleInstanceLock()) {
    console.log("Quitting application. Reason: another instance is already running");
    app.exit();
}

(async () => {
    await app.whenReady();

    const {
        clipboard,
        dialog,
        globalShortcut,
        ipcMain,
        nativeTheme,
        net,
        safeStorage,
        screen,
        shell,
        systemPreferences,
    } = await import("electron");

    const { default: mitt } = await import("mitt");
    const { platform } = await import("os");
    const Core = await import("./Core");
    const Extensions = await import("./Extensions");

    const dependencyRegistry = Core.DependencyRegistryModule.bootstrap();

    // Electron and Node Modules
    dependencyRegistry.register("App", app);
    dependencyRegistry.register("Clipboard", clipboard);
    dependencyRegistry.register("Dialog", dialog);
    dependencyRegistry.register("Emitter", mitt<Record<string, unknown>>());
    dependencyRegistry.register("GlobalShortcut", globalShortcut);
    dependencyRegistry.register("IpcMain", ipcMain);
    dependencyRegistry.register("NativeTheme", nativeTheme);
    dependencyRegistry.register("Net", net);
    dependencyRegistry.register("Platform", platform());
    dependencyRegistry.register("SafeStorage", safeStorage);
    dependencyRegistry.register("Screen", screen);
    dependencyRegistry.register("Shell", shell);
    dependencyRegistry.register("SystemPreferences", systemPreferences);

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
