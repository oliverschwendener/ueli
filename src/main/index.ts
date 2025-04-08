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

    const moduleRegistry = Core.ModuleRegistryModule.bootstrap();

    // Electron and Node Modules
    moduleRegistry.register("App", app);
    moduleRegistry.register("Clipboard", clipboard);
    moduleRegistry.register("Dialog", dialog);
    moduleRegistry.register("Emitter", mitt<Record<string, unknown>>());
    moduleRegistry.register("GlobalShortcut", globalShortcut);
    moduleRegistry.register("IpcMain", ipcMain);
    moduleRegistry.register("NativeTheme", nativeTheme);
    moduleRegistry.register("Net", net);
    moduleRegistry.register("Platform", platform());
    moduleRegistry.register("SafeStorage", safeStorage);
    moduleRegistry.register("Screen", screen);
    moduleRegistry.register("Shell", shell);
    moduleRegistry.register("SystemPreferences", systemPreferences);

    // Core Modules
    Core.App.bootstrap(moduleRegistry);
    Core.OperatingSystemModule.bootstrap(moduleRegistry);
    Core.CommandlineSwitchModule.bootstrap(moduleRegistry);
    Core.TaskSchedulerModule.bootstrap(moduleRegistry);
    Core.EnvironmentVariableProviderModule.bootstrap(moduleRegistry);
    Core.LinuxDesktopEnvironmentModule.bootstrap(moduleRegistry);
    Core.IniFileParserModule.bootstrap(moduleRegistry);
    Core.XmlParserModule.bootstrap(moduleRegistry);
    Core.EventEmitterModule.bootstrap(moduleRegistry);
    Core.EventSubscriberModule.bootstrap(moduleRegistry);
    Core.BrowserWindowRegistryModule.bootstrap(moduleRegistry);
    Core.BrowserWindowNotifierModule.bootstrap(moduleRegistry);
    Core.DateProviderModule.bootstrap(moduleRegistry);
    Core.LoggerModule.bootstrap(moduleRegistry);
    Core.ActionHandlerModule.bootstrap(moduleRegistry);
    Core.RandomStringProviderModule.bootstrap(moduleRegistry);
    Core.SafeStorageEncryptionModule.bootstrap(moduleRegistry);
    Core.AssetPathResolverModule.bootstrap(moduleRegistry);
    Core.ClipboardModule.bootstrap(moduleRegistry);
    Core.AboutUeliModule.bootstrap(moduleRegistry);
    Core.CommandlineUtilityModule.bootstrap(moduleRegistry);
    Core.AppleScriptUtilityModule.bootstrap(moduleRegistry);
    Core.FileSystemUtilityModule.bootstrap(moduleRegistry);
    await Core.PowershellUtilityModule.bootstrap(moduleRegistry);
    Core.SettingsFileModule.bootstrap(moduleRegistry);
    Core.SettingsReaderModule.bootstrap(moduleRegistry);
    Core.SettingsWriterModule.bootstrap(moduleRegistry);
    Core.SettingsManagerModule.bootstrap(moduleRegistry);
    Core.NativeThemeModule.bootstrap(moduleRegistry);
    Core.BrowserWindowModule.bootstrap(moduleRegistry);
    Core.ShellModule.bootstrap(moduleRegistry);
    Core.DockModule.bootstrap(moduleRegistry);
    await Core.ImageGeneratorModule.bootstrap(moduleRegistry);
    Core.TranslatorModule.bootstrap(moduleRegistry);
    Core.SearchIndexModule.bootstrap(moduleRegistry);
    Core.GlobalShortcutModule.bootstrap(moduleRegistry);
    Core.AutostartModule.bootstrap(moduleRegistry);
    Core.ExcludedSearchResultsModule.bootstrap(moduleRegistry);
    Core.FavoriteManagerModule.bootstrap(moduleRegistry);
    Core.UeliCommandModule.bootstrap(moduleRegistry);
    await Core.TrayIconModule.bootstrap(moduleRegistry);
    Core.DialogModule.bootstrap(moduleRegistry);
    Core.TerminalModule.bootstrap(moduleRegistry);
    Core.ExtensionRegistryModule.bootstrap(moduleRegistry);
    Core.DragAndDropModule.bootstrap(moduleRegistry);

    // Extensions
    Extensions.ExtensionLoader.bootstrap(moduleRegistry);
    await Core.ExtensionManagerModule.bootstrap(moduleRegistry);

    // Windows
    await Core.SearchWindowModule.bootstrap(moduleRegistry);
    await Core.SettingsWindowModule.bootstrap(moduleRegistry);

    Core.RescanOrchestratorModule.bootstrap(moduleRegistry);
})();
