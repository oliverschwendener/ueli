import type { OperatingSystem } from "@common/Core";
import type { ActionHandlerRegistry } from "@Core/ActionHandler";
import type { AppIconFilePathResolver } from "@Core/AppIconFilePathResolver";
import type { AppleScriptUtility } from "@Core/AppleScriptUtility";
import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type {
    BrowserWindowBackgroundMaterialProvider,
    BrowserWindowHtmlLoader,
    BrowserWindowVibrancyProvider,
} from "@Core/BrowserWindow";
import type { BrowserWindowNotifier } from "@Core/BrowserWindowNotifier";
import type { BrowserWindowRegistry } from "@Core/BrowserWindowRegistry";
import type { CommandlineUtility } from "@Core/CommandlineUtility";
import type { DateProvider } from "@Core/DateProvider";
import type { EnvironmentVariableProvider } from "@Core/EnvironmentVariableProvider";
import type { EventEmitter } from "@Core/EventEmitter";
import type { EventSubscriber } from "@Core/EventSubscriber";
import type { ExtensionRegistry } from "@Core/ExtensionRegistry";
import type { FileSystemUtility } from "@Core/FileSystemUtility";
import type { FileImageGenerator, UrlImageGenerator } from "@Core/ImageGenerator";
import type { IniFileParser } from "@Core/IniFileParser";
import type { LinuxDesktopEnvironmentResolver } from "@Core/LinuxDesktopEnvironment";
import type { Logger } from "@Core/Logger";
import type { Notification } from "@Core/Notification";
import type { PowershellUtility } from "@Core/PowershellUtility";
import type { RandomStringProvider } from "@Core/RandomStringProvider";
import type { SafeStorageEncryption } from "@Core/SafeStorageEncryption";
import type { SearchIndex } from "@Core/SearchIndex";
import type { SettingsFile } from "@Core/SettingsFile";
import type { SettingsManager } from "@Core/SettingsManager";
import type { SettingsReader } from "@Core/SettingsReader";
import type { SettingsWriter } from "@Core/SettingsWriter";
import type { TaskScheduler } from "@Core/TaskScheduler";
import type { TerminalRegistry } from "@Core/Terminal";
import type { Translator } from "@Core/Translator";
import type { UeliCommandInvoker } from "@Core/UeliCommand";
import type { WebBrowserRegistry } from "@Core/WebBrowser/Contract";
import type { XmlParser } from "@Core/XmlParser";
import type {
    App,
    Clipboard,
    Dialog,
    GlobalShortcut,
    IpcMain,
    NativeTheme,
    Net,
    SafeStorage,
    Screen,
    Shell,
    SystemPreferences,
} from "electron";
import type { Emitter } from "mitt";

export type UeliModules = {
    ActionHandlerRegistry: ActionHandlerRegistry;
    App: App;
    AppleScriptUtility: AppleScriptUtility;
    AssetPathResolver: AssetPathResolver;
    AppIconFilePathResolver: AppIconFilePathResolver;
    BrowserWindowBackgroundMaterialProvider: BrowserWindowBackgroundMaterialProvider;
    BrowserWindowHtmlLoader: BrowserWindowHtmlLoader;
    BrowserWindowNotifier: BrowserWindowNotifier;
    BrowserWindowRegistry: BrowserWindowRegistry;
    BrowserWindowVibrancyProvider: BrowserWindowVibrancyProvider;
    Clipboard: Clipboard;
    CommandlineUtility: CommandlineUtility;
    DateProvider: DateProvider;
    Dialog: Dialog;
    Emitter: Emitter<Record<string, unknown>>;
    EnvironmentVariableProvider: EnvironmentVariableProvider;
    EventEmitter: EventEmitter;
    EventSubscriber: EventSubscriber;
    ExtensionRegistry: ExtensionRegistry;
    FileImageGenerator: FileImageGenerator;
    FileSystemUtility: FileSystemUtility;
    GlobalShortcut: GlobalShortcut;
    IniFileParser: IniFileParser;
    IpcMain: IpcMain;
    LinuxDesktopEnvironmentResolver: LinuxDesktopEnvironmentResolver;
    Logger: Logger;
    NativeTheme: NativeTheme;
    Notification: Notification;
    Net: Net;
    OperatingSystem: OperatingSystem;
    Platform: string;
    PowershellUtility: PowershellUtility;
    RandomStringProvider: RandomStringProvider;
    SafeStorage: SafeStorage;
    SafeStorageEncryption: SafeStorageEncryption;
    Screen: Screen;
    SearchIndex: SearchIndex;
    SettingsFile: SettingsFile;
    SettingsManager: SettingsManager;
    SettingsReader: SettingsReader;
    SettingsWriter: SettingsWriter;
    Shell: Shell;
    SystemPreferences: SystemPreferences;
    TaskScheduler: TaskScheduler;
    TerminalRegistry: TerminalRegistry;
    Translator: Translator;
    UeliCommandInvoker: UeliCommandInvoker;
    UrlImageGenerator: UrlImageGenerator;
    WebBrowserRegistry: WebBrowserRegistry;
    XmlParser: XmlParser;
};
