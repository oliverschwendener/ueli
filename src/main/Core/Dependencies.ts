import type * as CommonCore from "@common/Core";
import type * as Electron from "electron";
import type { Emitter } from "mitt";
import type * as Core from ".";

export type Dependencies = {
    ActionHandlerRegistry: Core.ActionHandlerRegistry;
    App: Electron.App;
    AppleScriptUtility: Core.AppleScriptUtility;
    AssetPathResolver: Core.AssetPathResolver;
    BrowserWindowBackgroundMaterialProvider: Core.BrowserWindowBackgroundMaterialProvider;
    BrowserWindowNotifier: Core.BrowserWindowNotifier;
    BrowserWindowVibrancyProvider: Core.BrowserWindowVibrancyProvider;
    Clipboard: Electron.Clipboard;
    CommandlineUtility: Core.CommandlineUtility;
    DateProvider: Core.DateProvider;
    Dialog: Electron.Dialog;
    Emitter: Emitter<Record<string, unknown>>;
    EnvironmentVariableProvider: Core.EnvironmentVariableProvider;
    EventEmitter: Core.EventEmitter;
    EventSubscriber: Core.EventSubscriber;
    ExtensionRegistry: Core.ExtensionRegistry;
    FileImageGenerator: Core.FileImageGenerator;
    FileSystemUtility: Core.FileSystemUtility;
    GlobalShortcut: Electron.GlobalShortcut;
    IniFileParser: Core.IniFileParser;
    IpcMain: Electron.IpcMain;
    LinuxDesktopEnvironmentResolver: Core.LinuxDesktopEnvironmentResolver;
    Logger: Core.Logger;
    NativeTheme: Electron.NativeTheme;
    Net: Electron.Net;
    OperatingSystem: CommonCore.OperatingSystem;
    Platform: string;
    PowershellUtility: Core.PowershellUtility;
    RandomStringProvider: Core.RandomStringProvider;
    SafeStorage: Electron.SafeStorage;
    SafeStorageEncryption: Core.SafeStorageEncryption;
    Screen: Electron.Screen;
    SearchIndex: Core.SearchIndex;
    SettingsFile: Core.SettingsFile;
    SettingsManager: Core.SettingsManager;
    SettingsReader: Core.SettingsReader;
    SettingsWriter: Core.SettingsWriter;
    Shell: Electron.Shell;
    SystemPreferences: Electron.SystemPreferences;
    TaskScheduler: Core.TaskScheduler;
    TerminalRegistry: Core.TerminalRegistry;
    Translator: Core.Translator;
    UeliCommandInvoker: Core.UeliCommandInvoker;
    UrlImageGenerator: Core.UrlImageGenerator;
    XmlParser: Core.XmlParser;
};
