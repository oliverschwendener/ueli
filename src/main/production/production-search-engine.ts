import { ApplicationSearchPlugin } from "../plugins/application-search-plugin/application-search-plugin";
import { UserConfigOptions } from "../../common/config/user-config-options";
import { FileApplicationRepository } from "../plugins/application-search-plugin/file-application-repository";
import { ApplicationIconService } from "../plugins/application-search-plugin/application-icon-service";
import { generateMacAppIcons, generateWindowsAppIcons } from "../plugins/application-search-plugin/application-icon-helpers";
import { UeliCommandSearchPlugin } from "../plugins/ueli-command-search-plugin/ueli-command-search-plugin";
import { ShortcutsSearchPlugin } from "../plugins/shorcuts-search-plugin/shortcuts-search-plugin";
import { isWindows, isMacOs } from "../../common/helpers/operating-system-helpers";
import { platform } from "os";
import { executeUrlMacOs, executeUrlWindows } from "../executors/url-executor";
import { executeFilePathWindows, executeFilePathMacOs } from "../executors/file-path-executor";
import { SearchEngine } from "../search-engine";
import { EverythingExecutionPlugin } from "../plugins/everything-execution-plugin/everthing-execution-plugin";
import { SearchPlugin } from "../search-plugin";
import { ExecutionPlugin } from "../execution-plugin";
import { MdFindExecutionPlugin } from "../plugins/mdfind-execution-plugin/mdfind-execution-plugin";
import { TranslationExecutionPlugin } from "../plugins/translation-execution-plugin/translation-execution-plugin";
import { executeFilePathLocationMacOs, executeFilePathLocationWindows } from "../executors/file-path-location-executor";
import { TranslationSet } from "../../common/translation/translation-set";
import { WebSearchPlugin } from "../plugins/websearch-plugin/websearch-plugin";
import { Logger } from "../../common/logger/logger";
import { FileBrowserExecutionPlugin } from "../plugins/filebrowser-plugin/filebrowser-plugin";
import { isValidWindowsFilePath, isValidMacOsFilePath } from "../../common/helpers/file-path-validators";
import { getFileIconDataUrl } from "../../common/icon/generate-file-icon";
import { OperatingSystemCommandsPlugin } from "../plugins/operating-system-commands-plugin/operating-system-commands-plugin";
import { MacOsOperatingSystemCommandRepository } from "../plugins/operating-system-commands-plugin/mac-os-operating-system-command-repository";
import { WindowsOperatingSystemCommandRepository } from "../plugins/operating-system-commands-plugin/windows-operating-system-command-repository";

const filePathValidator = isWindows(platform()) ? isValidWindowsFilePath : isValidMacOsFilePath;
const filePathExecutor = isWindows(platform()) ? executeFilePathWindows : executeFilePathMacOs;
const filePathLocationExecutor = isWindows(platform()) ? executeFilePathLocationWindows : executeFilePathLocationMacOs;
const urlExecutor = isWindows(platform()) ? executeUrlWindows : executeUrlMacOs;
const appIconGenerator = isWindows(platform()) ? generateWindowsAppIcons : generateMacAppIcons;

export const getProductionSearchEngine = (userConfig: UserConfigOptions, translationSet: TranslationSet, logger: Logger): SearchEngine => {
    const operatingSystemCommandRepository = isWindows(platform())
        ? new WindowsOperatingSystemCommandRepository(translationSet)
        : new MacOsOperatingSystemCommandRepository(translationSet);

    const searchPlugins: SearchPlugin[] = [
        new UeliCommandSearchPlugin(translationSet),
        new ShortcutsSearchPlugin(
            userConfig.shortcutOptions,
            urlExecutor,
            filePathExecutor,
            filePathLocationExecutor,
            ),
        new ApplicationSearchPlugin(
            userConfig.applicationSearchOptions,
            new FileApplicationRepository(
                new ApplicationIconService(appIconGenerator),
                userConfig.applicationSearchOptions,
                ),
            filePathExecutor,
            filePathLocationExecutor,
            ),
        new OperatingSystemCommandsPlugin(
            userConfig.operatingSystemCommandsOptions,
            operatingSystemCommandRepository,
            ),
    ];

    const webSearchPlugin = new WebSearchPlugin(userConfig.websearchOptions, translationSet, urlExecutor);

    const executionPlugins: ExecutionPlugin[] = [
        webSearchPlugin,
        new FileBrowserExecutionPlugin(
            userConfig.fileBrowserOptions,
            filePathValidator,
            filePathExecutor,
            filePathLocationExecutor,
            getFileIconDataUrl),
        new TranslationExecutionPlugin(userConfig.translationOptions),
    ];

    const fallbackPlugins: ExecutionPlugin[] = [
        webSearchPlugin,
    ];

    if (isWindows(platform())) {
        executionPlugins.push(
            new EverythingExecutionPlugin(
                userConfig.everythingSearchOptions,
                filePathExecutor,
                filePathLocationExecutor));
    }
    if (isMacOs(platform())) {
        executionPlugins.push(
            new MdFindExecutionPlugin(
                userConfig.mdfindOptions,
                filePathExecutor,
                filePathLocationExecutor));
    }

    return new SearchEngine(
        searchPlugins,
        executionPlugins,
        fallbackPlugins,
        userConfig,
        translationSet,
        logger);
};
