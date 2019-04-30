import { ApplicationSearchPlugin } from "../plugins/application-search-plugin/application-search-plugin";
import { UserConfigOptions } from "../../common/config/user-config-options";
import { FileApplicationRepository } from "../plugins/application-search-plugin/file-application-repository";
import { ApplicationIconService } from "../plugins/application-search-plugin/application-icon-service";
import { generateMacAppIcons, generateWindowsAppIcons } from "../plugins/application-search-plugin/application-icon-helpers";
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
import { electronClipboardCopier } from "./electron-clipboard-copier";
import { UrlPlugin } from "../plugins/url-plugin/url-plugin";
import { EmailPlugin } from "../plugins/email-plugin/email-plugin";
import { ElectronStoreFavoriteRepository } from "../favorites/electron-store-favorite-repository";
import { CurrencyConverterPlugin } from "../plugins/currency-converter-plugin/currency-converter-plugin";
import { executeCommand } from "../executors/command-executor";
import { WorkflowPlugin } from "../plugins/workflow-plugin/workflow-plugin";
import { ProductionLogger } from "../../common/logger/production-logger";
import { CommandlinePlugin } from "../plugins/commandline-plugin/commandline-plugin";
import { windowsCommandLineExecutor, macOsCommandLineExecutor } from "../executors/commandline-executor";

const filePathValidator = isWindows(platform()) ? isValidWindowsFilePath : isValidMacOsFilePath;
const filePathExecutor = isWindows(platform()) ? executeFilePathWindows : executeFilePathMacOs;
const filePathLocationExecutor = isWindows(platform()) ? executeFilePathLocationWindows : executeFilePathLocationMacOs;
const urlExecutor = isWindows(platform()) ? executeUrlWindows : executeUrlMacOs;
const appIconGenerator = isWindows(platform()) ? generateWindowsAppIcons : generateMacAppIcons;
const commandlineExecutor = isWindows(platform()) ? windowsCommandLineExecutor : macOsCommandLineExecutor;

export const getProductionSearchEngine = (config: UserConfigOptions, translationSet: TranslationSet): SearchEngine => {
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
            new FileApplicationRepository(
                new ApplicationIconService(appIconGenerator),
                config.applicationSearchOptions,
                ),
            filePathExecutor,
            filePathLocationExecutor,
            ),
        new OperatingSystemCommandsPlugin(
            config.operatingSystemCommandsOptions,
            operatingSystemCommandRepository,
            ),
        new WorkflowPlugin(
            config.workflowOptions,
            filePathExecutor,
            urlExecutor,
            executeCommand,
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
        new TranslationPlugin(config.translationOptions),
        new CalculatorPlugin(config.calculatorOptions, translationSet, electronClipboardCopier),
        new UrlPlugin(config.urlOptions, translationSet, urlExecutor),
        new EmailPlugin(config.emailOptions, translationSet, urlExecutor),
        new CurrencyConverterPlugin(config.currencyConverterOptions, translationSet, electronClipboardCopier),
        new CommandlinePlugin(config.commandlineOptions, translationSet, commandlineExecutor),
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
        new ProductionLogger(filePathExecutor),
        new ElectronStoreFavoriteRepository(),
    );
};
