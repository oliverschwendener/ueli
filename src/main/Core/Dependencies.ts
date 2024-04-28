import type * as CommonCore from "@common/Core";
import type * as Electron from "electron";
import type { Emitter } from "mitt";
import type * as Core from ".";

export type Dependencies = {
    ActionHandlerRegistry?: Core.ActionHandlerRegistry;
    App?: Electron.App;
    AppleScriptUtility?: Core.AppleScriptUtility;
    AssetPathResolver?: Core.AssetPathResolver;
    BrowserWindowNotifier?: Core.BrowserWindowNotifier;
    Clipboard?: Electron.Clipboard;
    Clock?: Core.Clock;
    CommandlineUtility?: Core.CommandlineUtility;
    Dialog?: Electron.Dialog;
    Emitter?: Emitter<Record<string, unknown>>;
    EnvironmentVariableProvider?: Core.EnvironmentVariableProvider;
    EventEmitter?: Core.EventEmitter;
    EventSubscriber?: Core.EventSubscriber;
    ExcludedSearchResults?: Core.ExcludedSearchResults;
    ExtensionRegistry?: Core.ExtensionRegistry;
    FavoriteManager?: Core.FavoriteManager;
    FileImageGenerator?: Core.FileImageGenerator;
    FileSystemUtility?: Core.FileSystemUtility;
    GlobalShortcut?: Electron.GlobalShortcut;
    IniFileParser?: Core.IniFileParser;
    IpcMain?: Electron.IpcMain;
    Logger?: Core.Logger;
    NativeTheme?: Electron.NativeTheme;
    Net?: Electron.Net;
    OperatingSystem?: CommonCore.OperatingSystem;
    Platform?: string;
    PowershellUtility?: Core.PowershellUtility;
    RandomStringProvider?: Core.RandomStringProvider;
    SafeStorage?: Electron.SafeStorage;
    SafeStorageEncryption?: Core.SafeStorageEncryption;
    SearchIndex?: Core.SearchIndex;
    SettingsFile?: Core.SettingsFile;
    SettingsManager?: Core.SettingsManager;
    SettingsReader?: Core.SettingsReader;
    SettingsWriter?: Core.SettingsWriter;
    Shell?: Electron.Shell;
    SystemPreferences?: Electron.SystemPreferences;
    Translator?: Core.Translator;
    UeliCommandInvoker?: Core.UeliCommandInvoker;
    UrlImageGenerator?: Core.UrlImageGenerator;
};
