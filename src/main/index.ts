import {
    app,
    clipboard,
    dialog,
    globalShortcut,
    ipcMain,
    nativeTheme,
    net,
    shell,
    systemPreferences,
    type App,
    type Clipboard,
    type Dialog,
    type GlobalShortcut,
    type IpcMain,
    type NativeTheme,
    type Net,
    type Shell,
    type SystemPreferences,
} from "electron";
import mitt, { Emitter } from "mitt";
import { platform } from "os";
import {
    AboutUeliModule,
    ActionHandlerModule,
    BrowserWindowModule,
    ClockModule,
    CommandlineUtilityModule,
    DependencyInjectorModule,
    DialogModule,
    EventEmitterModule,
    EventSubscriberModule,
    ExtensionAssetsModule,
    ExtensionCacheFolderModule,
    ExtensionManagerModule,
    FileSystemUtilityModule,
    GlobalShortcutModule,
    LoggerModule,
    NativeThemeModule,
    OperatingSystemModule,
    SearchIndexModule,
    SettingsFileModule,
    SettingsManagerModule,
    SettingsReaderModule,
    SettingsWriterModule,
    TrayIconModule,
    UeliCommandModule,
} from "./Core";
import { ExtensionsModule } from "./Extensions";

(async () => {
    await app.whenReady();

    app.dock?.hide();

    const dependencyInjector = DependencyInjectorModule.bootstrap();

    // Electron Modules
    dependencyInjector.registerInstance<string>("Platform", platform());
    dependencyInjector.registerInstance<App>("App", app);
    dependencyInjector.registerInstance<IpcMain>("IpcMain", ipcMain);
    dependencyInjector.registerInstance<NativeTheme>("NativeTheme", nativeTheme);
    dependencyInjector.registerInstance<Shell>("Shell", shell);
    dependencyInjector.registerInstance<GlobalShortcut>("GlobalShortcut", globalShortcut);
    dependencyInjector.registerInstance<Emitter<Record<string, unknown>>>("Emitter", mitt<Record<string, unknown>>());
    dependencyInjector.registerInstance<SystemPreferences>("SystemPreferences", systemPreferences);
    dependencyInjector.registerInstance<Dialog>("Dialog", dialog);
    dependencyInjector.registerInstance<Clipboard>("Clipboard", clipboard);
    dependencyInjector.registerInstance<Net>("Net", net);

    // Ueli Modules
    ClockModule.bootstrap(dependencyInjector);
    AboutUeliModule.bootstrap(dependencyInjector);
    LoggerModule.bootstrap(dependencyInjector);
    EventEmitterModule.bootstrap(dependencyInjector);
    EventSubscriberModule.bootstrap(dependencyInjector);
    CommandlineUtilityModule.bootstrap(dependencyInjector);
    FileSystemUtilityModule.bootstrap(dependencyInjector);
    OperatingSystemModule.bootstrap(dependencyInjector);
    SettingsFileModule.bootstrap(dependencyInjector);
    SettingsReaderModule.bootstrap(dependencyInjector);
    SettingsWriterModule.bootstrap(dependencyInjector);
    SettingsManagerModule.bootstrap(dependencyInjector);
    SearchIndexModule.bootstrap(dependencyInjector);
    NativeThemeModule.bootstrap(dependencyInjector);
    await BrowserWindowModule.bootstrap(dependencyInjector);
    GlobalShortcutModule.bootstrap(dependencyInjector);
    ActionHandlerModule.bootstrap(dependencyInjector);
    UeliCommandModule.bootstrap(dependencyInjector);
    TrayIconModule.bootstrap(dependencyInjector);
    DialogModule.bootstrap(dependencyInjector);
    ExtensionAssetsModule.bootstrap(dependencyInjector);
    await ExtensionCacheFolderModule.bootstrap(dependencyInjector);
    ExtensionsModule.bootstrap(dependencyInjector);
    ExtensionManagerModule.bootstrap(dependencyInjector);
})();
