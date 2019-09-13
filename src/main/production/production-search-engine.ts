import { ApplicationSearchPlugin } from "../plugins/application-search-plugin/application-search-plugin";
import { UserConfigOptions } from "../../common/config/user-config-options";
import { UeliCommandSearchPlugin } from "../plugins/ueli-command-search-plugin/ueli-command-search-plugin";
import { ShortcutsSearchPlugin } from "../plugins/shortcuts-search-plugin/shortcuts-search-plugin";
import { isWindows, isMacOs } from "../../common/helpers/operating-system-helpers";
import { platform } from "os";
import { executeUrlMacOs, executeUrlWindows } from "../executors/url-executor";
import { executeFilePathWindows, executeFilePathMacOs } from "../executors/file-path-executor";
import { SearchEngine } from "../search-engine";
import { EverythingPlugin } from "../plugins/everything-plugin/everthing-plugin";
import { SearchPlugin } from "../search-plugin";
import { ExecutionPlugin } from "../execution-plugin";
import { MdFindPlugin } from "../plugins/mdfind-plugin/mdfind-plugin";
import { TranslationPlugin } from "../plugins/translation-plugin/translation-plugin";
import { executeFilePathLocationMacOs, executeFilePathLocationWindows } from "../executors/file-path-location-executor";
import { TranslationSet } from "../../common/translation/translation-set";
import { WebSearchPlugin } from "../plugins/websearch-plugin/websearch-plugin";
import { FileBrowserExecutionPlugin } from "../plugins/filebrowser-plugin/filebrowser-plugin";
import { isValidWindowsFilePath, isValidMacOsFilePath } from "../../common/helpers/file-path-validators";
import { getFileIconDataUrl } from "../../common/icon/generate-file-icon";
import { OperatingSystemCommandsPlugin } from "../plugins/operating-system-commands-plugin/operating-system-commands-plugin";
import { MacOsOperatingSystemCommandRepository } from "../plugins/operating-system-commands-plugin/mac-os-operating-system-command-repository";
import { WindowsOperatingSystemCommandRepository } from "../plugins/operating-system-commands-plugin/windows-operating-system-command-repository";
import { CalculatorPlugin } from "../plugins/calculator-plugin/calculator-plugin";
import { electronClipboardCopier } from "../executors/electron-clipboard-copier";
import { UrlPlugin } from "../plugins/url-plugin/url-plugin";
import { EmailPlugin } from "../plugins/email-plugin/email-plugin";
import { ElectronStoreFavoriteRepository } from "../favorites/electron-store-favorite-repository";
import { CurrencyConverterPlugin } from "../plugins/currency-converter-plugin/currency-converter-plugin";
import { executeCommand } from "../executors/command-executor";
import { WorkflowPlugin } from "../plugins/workflow-plugin/workflow-plugin";
import { CommandlinePlugin } from "../plugins/commandline-plugin/commandline-plugin";
import { windowsCommandLineExecutor, macOsCommandLineExecutor } from "../executors/commandline-executor";
import { OperatingSystemSettingsPlugin } from "../plugins/operating-system-settings-plugin/operating-system-settings-plugin";
import { MacOsOperatingSystemSettingRepository } from "../plugins/operating-system-settings-plugin/macos-operating-system-setting-repository";
import { executeWindowsOperatingSystemSetting, executeMacOSOperatingSystemSetting } from "../executors/operating-system-setting-executor";
import { WindowsOperatingSystemSettingRepository } from "../plugins/operating-system-settings-plugin/windows-operating-system-setting-repository";
import { SimpleFolderSearchPlugin } from "../plugins/simple-folder-search-plugin/simple-folder-search-plugin";
import { Logger } from "../../common/logger/logger";
import { UwpPlugin } from "../plugins/uwp-plugin/uwp-plugin";
import { InMemoryUwpAppRepository } from "../plugins/uwp-plugin/inmemory-uwp-app-repository";
import { ColorConverterPlugin } from "../plugins/color-converter-plugin/color-converter-plugin";
import { ProductionApplicationRepository } from "../plugins/application-search-plugin/production-application-repository";
import { defaultWindowsAppIcon, defaultMacOsAppIcon } from "../../common/icon/default-icons";
import { ApplicationIconService } from "../plugins/application-search-plugin/application-icon-service";
import { generateWindowsAppIcons } from "../plugins/application-search-plugin/windows-app-icon-generator";
import { windowsFileSearcher as powershellFileSearcher, macosFileSearcher } from "../executors/file-searchers";
import { searchWindowsApplications, searchMacApplications } from "../executors/application-searcher";
import { generateMacAppIcons } from "../plugins/application-search-plugin/mac-os-app-icon-generator";

const filePathValidator = isWindows(platform()) ? isValidWindowsFilePath : isValidMacOsFilePath;
const filePathExecutor = isWindows(platform()) ? executeFilePathWindows : executeFilePathMacOs;
const filePathLocationExecutor = isWindows(platform()) ? executeFilePathLocationWindows : executeFilePathLocationMacOs;
const urlExecutor = isWindows(platform()) ? executeUrlWindows : executeUrlMacOs;
const commandlineExecutor = isWindows(platform()) ? windowsCommandLineExecutor : macOsCommandLineExecutor;
const operatingSystemSettingsRepository = isWindows(platform()) ? new WindowsOperatingSystemSettingRepository() : new MacOsOperatingSystemSettingRepository();
const operatingSystemSettingExecutor = isWindows(platform()) ? executeWindowsOperatingSystemSetting : executeMacOSOperatingSystemSetting;
const applicationSearcher = isWindows(platform()) ? searchWindowsApplications : searchMacApplications;
const appIconGenerator = isWindows(platform()) ? generateWindowsAppIcons : generateMacAppIcons;
const defaultAppIcon = isWindows(platform()) ? defaultWindowsAppIcon : defaultMacOsAppIcon;
const fileSearcher = isWindows(platform()) ? powershellFileSearcher : macosFileSearcher;

export function getProductionSearchEngine(config: UserConfigOptions, translationSet: TranslationSet, logger: Logger): SearchEngine {
    const operatingSystemCommandRepository = isWindows(platform())
        ? new WindowsOperatingSystemCommandRepository(translationSet)
        : new MacOsOperatingSystemCommandRepository(translationSet);

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
            filePathExecutor,
            urlExecutor,
            executeCommand,
        ),
        new SimpleFolderSearchPlugin(
            config.simpleFolderSearchOptions,
            fileSearcher,
            filePathExecutor,
            filePathLocationExecutor,
        ),
    ];

    const webSearchPlugin = new WebSearchPlugin(config.websearchOptions, translationSet, urlExecutor);

    const executionPlugins: ExecutionPlugin[] = [
        webSearchPlugin,
        new FileBrowserExecutionPlugin(
            config.fileBrowserOptions,
            filePathValidator,
            filePathExecutor,
            filePathLocationExecutor,
            getFileIconDataUrl),
        new TranslationPlugin(config.translationOptions, electronClipboardCopier),
        new CalculatorPlugin(config.calculatorOptions, translationSet, electronClipboardCopier),
        new UrlPlugin(config.urlOptions, translationSet, urlExecutor),
        new EmailPlugin(config.emailOptions, translationSet, urlExecutor),
        new CurrencyConverterPlugin(config.currencyConverterOptions, translationSet, electronClipboardCopier),
        new CommandlinePlugin(config.commandlineOptions, translationSet, commandlineExecutor),
        new ColorConverterPlugin(config.colorConverterOptions, electronClipboardCopier),
    ];

    const fallbackPlugins: ExecutionPlugin[] = [
        webSearchPlugin,
    ];

    if (isWindows(platform())) {
        executionPlugins.push(
            new EverythingPlugin(
                config.everythingSearchOptions,
                filePathExecutor,
                filePathLocationExecutor));
        searchPlugins.push(new UwpPlugin(config.uwpSearchOptions, new InMemoryUwpAppRepository(), executeCommand));
    }
    if (isMacOs(platform())) {
        executionPlugins.push(
            new MdFindPlugin(
                config.mdfindOptions,
                filePathExecutor,
                filePathLocationExecutor));
    }

    return new SearchEngine(
        searchPlugins,
        executionPlugins,
        fallbackPlugins,
        config,
        translationSet,
        new ElectronStoreFavoriteRepository(),
    );
}
