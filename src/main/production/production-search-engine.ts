import { ApplicationSearchPlugin } from "../plugins/application-search-plugin/application-search-plugin";
import { UserConfigOptions } from "../../common/config/user-config-options";
import { UeliCommandSearchPlugin } from "../plugins/ueli-command-search-plugin/ueli-command-search-plugin";
import { ShortcutsSearchPlugin } from "../plugins/shortcuts-search-plugin/shortcuts-search-plugin";
import { homedir } from "os";
import { openUrlInBrowser } from "../executors/url-executor";
import { executeFilePathWindows, executeFilePathMacOs, executeFilePathLinux } from "../executors/file-path-executor";
import { SearchEngine } from "../search-engine";
import { EverythingPlugin } from "../plugins/everything-plugin/everthing-plugin";
import { SearchPlugin } from "../search-plugin";
import { ExecutionPlugin } from "../execution-plugin";
import { MdFindPlugin } from "../plugins/mdfind-plugin/mdfind-plugin";
import { TranslationPlugin } from "../plugins/translation-plugin/translation-plugin";
import { openFileLocation } from "../executors/file-path-location-executor";
import { TranslationSet } from "../../common/translation/translation-set";
import { WebSearchPlugin } from "../plugins/websearch-plugin/websearch-plugin";
import { FileBrowserExecutionPlugin } from "../plugins/filebrowser-plugin/filebrowser-plugin";
import { isValidWindowsFilePath, isValidUnixFilePath } from "../../common/helpers/file-path-validators";
import { getFileIconDataUrl } from "../../common/icon/generate-file-icon";
import { OperatingSystemCommandsPlugin } from "../plugins/operating-system-commands-plugin/operating-system-commands-plugin";
import { MacOsOperatingSystemCommandRepository } from "../plugins/operating-system-commands-plugin/mac-os-operating-system-command-repository";
import { WindowsOperatingSystemCommandRepository } from "../plugins/operating-system-commands-plugin/windows-operating-system-command-repository";
import { LinuxOperatingSystemCommandRepository } from "../plugins/operating-system-commands-plugin/linux-operating-system-command-repository";
import { CalculatorPlugin } from "../plugins/calculator-plugin/calculator-plugin";
import { electronClipboardCopier } from "../executors/electron-clipboard-copier";
import { UrlPlugin } from "../plugins/url-plugin/url-plugin";
import { EmailPlugin } from "../plugins/email-plugin/email-plugin";
import { ElectronStoreFavoriteRepository } from "../favorites/electron-store-favorite-repository";
import { CurrencyConverterPlugin } from "../plugins/currency-converter-plugin/currency-converter-plugin";
import { executeCommand } from "../executors/command-executor";
import { WorkflowPlugin } from "../plugins/workflow-plugin/workflow-plugin";
import { CommandlinePlugin } from "../plugins/commandline-plugin/commandline-plugin";
import { windowsCommandLineExecutor, macOsCommandLineExecutor, linuxCommandLineExecutor } from "../executors/commandline-executor";
import { OperatingSystemSettingsPlugin } from "../plugins/operating-system-settings-plugin/operating-system-settings-plugin";
import { MacOsOperatingSystemSettingRepository } from "../plugins/operating-system-settings-plugin/macos-operating-system-setting-repository";
import {
    executeMacOSOperatingSystemSetting,
    executeWindowsOperatingSystemSetting,
    executeMacOSOperatingSystemSetting,
    executeLinuxOperatingSystemSetting,
} from "../executors/operating-system-setting-executor";
import { WindowsOperatingSystemSettingRepository } from "../plugins/operating-system-settings-plugin/windows-operating-system-setting-repository";
import { SimpleFolderSearchPlugin } from "../plugins/simple-folder-search-plugin/simple-folder-search-plugin";
import { Logger } from "../../common/logger/logger";
import { UwpPlugin } from "../plugins/uwp-plugin/uwp-plugin";
import { ColorConverterPlugin } from "../plugins/color-converter-plugin/color-converter-plugin";
import { ProductionApplicationRepository } from "../plugins/application-search-plugin/production-application-repository";
import { defaultMacOsAppIcon, defaultWindowsAppIcon } from "../../common/icon/default-icons";
import { ApplicationIconService } from "../plugins/application-search-plugin/application-icon-service";
import { generateWindowsAppIcons } from "../plugins/application-search-plugin/windows-app-icon-generator";
import { windowsFileSearcher as powershellFileSearcher, macosFileSearcher, linuxFileSearcher } from "../executors/file-searchers";
import { searchWindowsApplications, searchMacApplications, searchLinuxApplications } from "../executors/application-searcher";
import { generateMacAppIcons } from "../plugins/application-search-plugin/mac-os-app-icon-generator";
import { generateLinuxAppIcons } from "../plugins/application-search-plugin/linux-os-app-icon-generator";
import { DictionaryPlugin } from "../plugins/dictionary-plugin/dictionary-plugin";
import { ControlPanelPlugin } from "../plugins/control-panel-plugin/control-panel-plugin";
import { getAllUwpApps } from "../plugins/uwp-plugin/uwp-apps-retriever";
import { getGoogleDictionaryDefinitions } from "../plugins/dictionary-plugin/google-dictionary-definition-retriever";
import { everythingSearcher } from "../plugins/everything-plugin/everything-searcher";
import { mdfindSearcher } from "../plugins/mdfind-plugin/mdfind-searcher";
import { OperatingSystem, OperatingSystemVersion } from "../../common/operating-system";
import { BrowserBookmarksPlugin } from "../plugins/browser-bookmarks-plugin/browser-bookmarks-plugin";
import { GoogleChromeBookmarkRepository } from "../plugins/browser-bookmarks-plugin/google-chrome-bookmark-repository";
import { BraveBookmarkRepository } from "../plugins/browser-bookmarks-plugin/brave-bookmark-repository";
import { SideKickBookmarkRepository } from "../plugins/browser-bookmarks-plugin/sidekick-bookmark-repository";
import { VivaldiBookmarkRepository } from "../plugins/browser-bookmarks-plugin/vivaldi-bookmark-repository";
import { EdgeBookmarkRepository } from "../plugins/browser-bookmarks-plugin/edge-bookmark-repository";
import { FirefoxBookmarkRepository } from "../plugins/browser-bookmarks-plugin/firefox-bookmark-repository";
import { YandexBookmarkRepository } from "../plugins/browser-bookmarks-plugin/yandex-bookmark-repository";
import { ChromiumBookmarkRepository } from "../plugins/browser-bookmarks-plugin/chromium-bookmark-repository";
import { getWebearchSuggestions } from "../executors/websearch-suggestion-resolver";
import { LinuxOperatingSystemSettingRepository } from "../plugins/operating-system-settings-plugin/linux-operating-system-setting-repository";
import { WeatherPlugin } from "../plugins/weather-plugin/weather-plugin";
import { LoremIpsumPlugin } from "../plugins/lorem-ipsum-plugin/lorem-ipsum-plugin";

export function getProductionSearchEngine(
    operatingSystem: OperatingSystem,
    operatingSystemVersion: OperatingSystemVersion,
    config: UserConfigOptions,
    translationSet: TranslationSet,
    logger: Logger,
): SearchEngine {
    let filePathLocationExecutor = openFileLocation;
    let urlExecutor = openUrlInBrowser;
    const OsMapping = {
        [OperatingSystem.Windows]: {
            filePathValidator: isValidWindowsFilePath,
            filePathExecutor: executeFilePathWindows,
            commandlineExecutor: windowsCommandLineExecutor,
            operatingSystemSettingsRepository: WindowsOperatingSystemSettingRepository,
            operatingSystemSettingExecutor: executeWindowsOperatingSystemSetting,
            applicationSearcher: searchWindowsApplications,
            appIconGenerator: generateWindowsAppIcons,
            defaultAppIcon: defaultWindowsAppIcon,
            fileSearcher: powershellFileSearcher,
            chromeBookmarksFilePath: `${homedir()}\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Bookmarks`,
            braveBookmarksFilePath: `${homedir()}\\AppData\\Local\\BraveSoftware\\Brave-Browser\\User Data\\Default\\Bookmarks`,
            vivaldiBookmarksFilePath: `${homedir()}\\AppData\\Local\\Vivaldi\\User Data\\Default\\Bookmarks`,
            sideKickBookmarkFilePath: `${homedir()}\\AppData\\Local\\Sidekick\\User Data\\Default\\Bookmarks`,
            edgeBookmarksFilePath: `${homedir()}\\AppData\\Local\\Microsoft\\Edge\\User Data\\Default\\Bookmarks`,
            firefoxUserDataFolderPath: `${homedir()}\\AppData\\Roaming\\Mozilla\\Firefox`,
            chromiumBookmarksFilePath: `${homedir()}\\AppData\\Local\\Chromium\\User Data\\Default\\Bookmarks`,
            operatingSystemCommandRepository: WindowsOperatingSystemCommandRepository,
        },
        [OperatingSystem.macOS]: {
            filePathValidator: isValidUnixFilePath,
            filePathExecutor: executeFilePathMacOs,
            commandlineExecutor: macOsCommandLineExecutor,
            operatingSystemSettingsRepository: MacOsOperatingSystemSettingRepository,
            operatingSystemSettingExecutor: executeMacOSOperatingSystemSetting,
            applicationSearcher: searchMacApplications,
            appIconGenerator: generateMacAppIcons,
            defaultAppIcon: defaultMacOsAppIcon,
            fileSearcher: macosFileSearcher,
            chromeBookmarksFilePath: `${homedir()}/Library/Application\ Support/Google/Chrome/Default/Bookmarks`,
            braveBookmarksFilePath: `${homedir()}/Library/Application\ Support/BraveSoftware/Brave-Browser/Default/Bookmarks`,
            vivaldiBookmarksFilePath: `${homedir()}/Library/Application\ Support/Vivaldi/Default/Bookmarks`,
            sideKickBookmarkFilePath: `${homedir()}/Library/Application\ Support/Sidekick/Default/Bookmarks`,
            edgeBookmarksFilePath: `${homedir()}/Library/Application\ Support/Microsoft Edge/Default/Bookmarks`,
            firefoxUserDataFolderPath: `${homedir()}/Library/Application\ Support/Firefox`,
            chromiumBookmarksFilePath: `${homedir()}/Library/Application\ Support/Chromium/Default/Bookmarks`,
            operatingSystemCommandRepository: MacOsOperatingSystemCommandRepository,
        },
        [OperatingSystem.Linux]: {
            filePathValidator: isValidUnixFilePath,
            filePathExecutor: executeFilePathLinux,
            commandlineExecutor: linuxCommandLineExecutor,
            operatingSystemSettingsRepository: LinuxOperatingSystemSettingRepository,
            operatingSystemSettingExecutor: executeLinuxOperatingSystemSetting,
            applicationSearcher: searchLinuxApplications,
            appIconGenerator: generateLinuxAppIcons,
            // Let it be for now
            defaultAppIcon: defaultMacOsAppIcon,
            // TODO: FIX IT
            fileSearcher: linuxFileSearcher,
            // I can only verify chrome/chromium/edge. Pls send help.
            chromeBookmarksFilePath: `${homedir()}/.config/google-chrome/Default/Bookmarks`,
            braveBookmarksFilePath: `${homedir()}/.config/BraveSoftware/Brave-Browser/Default/Bookmarks`,
            vivaldiBookmarksFilePath: `${homedir()}/.config/Vivaldi/Default/Bookmarks`,
            sideKickBookmarkFilePath: `${homedir()}/.config/Support/Sidekick/Default/Bookmarks`,
            edgeBookmarksFilePath: `${homedir()}/.config/microsoft-edge-beta/Default/Bookmarks`,
            firefoxUserDataFolderPath: `${homedir()}/.config/Firefox`,
            chromiumBookmarksFilePath: `${homedir()}/.config/chromium/Default/Bookmarks`,
            operatingSystemCommandRepository: LinuxOperatingSystemCommandRepository,
        },
    }

    const OsConfig = OsMapping[operatingSystem];
    const filePathValidator = OsConfig.filePathValidator;
    const filePathExecutor = OsConfig.filePathExecutor;
    const commandlineExecutor = OsConfig.commandlineExecutor;
    const operatingSystemSettingsRepository = new OsConfig.operatingSystemSettingsRepository();
    const operatingSystemSettingExecutor = OsConfig.operatingSystemSettingExecutor;
    const applicationSearcher = OsConfig.applicationSearcher;
    const appIconGenerator = OsConfig.appIconGenerator;
    const defaultAppIcon = OsConfig.defaultAppIcon;
    const fileSearcher = OsConfig.fileSearcher;
    const chromeBookmarksFilePath = OsConfig.chromeBookmarksFilePath;
    const braveBookmarksFilePath = OsConfig.braveBookmarksFilePath;
    const vivaldiBookmarksFilePath = OsConfig.vivaldiBookmarksFilePath;
    const sideKickBookmarkFilePath = OsConfig.sideKickBookmarkFilePath;
    const edgeBookmarksFilePath = OsConfig.edgeBookmarksFilePath;
    const firefoxUserDataFolderPath = OsConfig.firefoxUserDataFolderPath;
    const chromiumBookmarksFilePath = OsConfig.chromiumBookmarksFilePath;
    const operatingSystemCommandRepository = new OsConfig.operatingSystemCommandRepository(translationSet);

    const searchPlugins: SearchPlugin[] = [
        new UeliCommandSearchPlugin(translationSet),
        new ShortcutsSearchPlugin(
            config.shortcutOptions,
            urlExecutor,
            filePathExecutor,
            filePathLocationExecutor,
            executeCommand,
        ),
        new ApplicationSearchPlugin(
            config.applicationSearchOptions,
            new ProductionApplicationRepository(
                config.applicationSearchOptions,
                defaultAppIcon,
                new ApplicationIconService(appIconGenerator, logger),
                applicationSearcher,
                logger,
                operatingSystemVersion,
            ),
            filePathExecutor,
            filePathLocationExecutor,
        ),
        new OperatingSystemCommandsPlugin(
            config.operatingSystemCommandsOptions,
            operatingSystemCommandRepository,
            executeCommand,
        ),
        new OperatingSystemSettingsPlugin(
            config.operatingSystemSettingsOptions,
            translationSet,
            operatingSystemSettingsRepository,
            operatingSystemSettingExecutor,
        ),
        new WorkflowPlugin(
            config.workflowOptions,
            config.commandlineOptions,
            filePathExecutor,
            urlExecutor,
            commandlineExecutor,
        ),
        new SimpleFolderSearchPlugin(
            config.simpleFolderSearchOptions,
            fileSearcher,
            filePathExecutor,
            filePathLocationExecutor,
        ),
        new BrowserBookmarksPlugin(
            config.browserBookmarksOptions,
            translationSet,
            [
                new BraveBookmarkRepository(braveBookmarksFilePath),
                new ChromiumBookmarkRepository(chromiumBookmarksFilePath),
                new EdgeBookmarkRepository(edgeBookmarksFilePath),
                new GoogleChromeBookmarkRepository(chromeBookmarksFilePath),
                new SideKickBookmarkRepository(sideKickBookmarkFilePath),
                new VivaldiBookmarkRepository(vivaldiBookmarksFilePath),
                new YandexBookmarkRepository(yandexBookmarksFilePath),
            ],
            urlExecutor,
        ),
    ];

    const webSearchPlugin = new WebSearchPlugin(
        config.websearchOptions,
        translationSet,
        urlExecutor,
        getWebearchSuggestions,
    );

    const executionPlugins: ExecutionPlugin[] = [
        webSearchPlugin,
        new FileBrowserExecutionPlugin(
            config.fileBrowserOptions,
            filePathValidator,
            filePathExecutor,
            filePathLocationExecutor,
            getFileIconDataUrl,
        ),
        new TranslationPlugin(config.translationOptions, electronClipboardCopier),
        new CalculatorPlugin(config, translationSet, electronClipboardCopier),
        new UrlPlugin(config.urlOptions, translationSet, urlExecutor),
        new EmailPlugin(config.emailOptions, translationSet, urlExecutor),
        new CurrencyConverterPlugin(config, translationSet, electronClipboardCopier),
        new CommandlinePlugin(config.commandlineOptions, translationSet, commandlineExecutor, logger),
        new ColorConverterPlugin(config.colorConverterOptions, electronClipboardCopier),
        new DictionaryPlugin(config.dictionaryOptions, electronClipboardCopier, getGoogleDictionaryDefinitions),
        new WeatherPlugin(config, translationSet, electronClipboardCopier),
        new LoremIpsumPlugin(config.loremIpsumOptions, translationSet, electronClipboardCopier),
    ];

    const fallbackPlugins: ExecutionPlugin[] = [webSearchPlugin];

    if (operatingSystem === OperatingSystem.Windows) {
        executionPlugins.push(
            new EverythingPlugin(
                config.everythingSearchOptions,
                filePathExecutor,
                filePathLocationExecutor,
                everythingSearcher,
            ),
        );
        searchPlugins.push(new UwpPlugin(config.uwpSearchOptions, filePathExecutor, getAllUwpApps));
        searchPlugins.push(new ControlPanelPlugin(config.controlPanelOptions));
    }
    if (operatingSystem === OperatingSystem.macOS) {
        executionPlugins.push(
            new MdFindPlugin(config.mdfindOptions, filePathExecutor, filePathLocationExecutor, mdfindSearcher),
        );
    }

    return new SearchEngine(
        searchPlugins,
        executionPlugins,
        fallbackPlugins,
        config.searchEngineOptions,
        config.generalOptions.logExecution,
        translationSet,
        new ElectronStoreFavoriteRepository(),
    );
}
